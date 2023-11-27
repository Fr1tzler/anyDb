import { DbQueryExecutor } from '../database/types'
import { EntitySchema } from '../entity'
import { EntitySchemaType, FieldType, SchemaFieldType } from '../types'
import { IListAllResponse } from '../utils/types'

export interface IEntitySchemaRepository {
  listAll(
    offset?: number,
    limit?: number,
  ): Promise<IListAllResponse<EntitySchema>>;
  getOne(entitySchemaId: string): Promise<EntitySchema | null>;
  createOne(partialSchema: Partial<EntitySchema>): Promise<EntitySchema | null>;
  updateOne(
    entitySchemaId: string,
    partialSchema: Partial<EntitySchema>,
  ): Promise<EntitySchema | null>;
  deleteOne(entitySchemaId: string): Promise<void>;
}

export class EntitySchemaRepository implements IEntitySchemaRepository {
  constructor(private dbQuery: DbQueryExecutor) {}

  async listAll(
    offset: number = 0,
    limit: number = 20,
  ): Promise<IListAllResponse<EntitySchema>> {
    const totalQueryResult = await this.dbQuery<{ total: string }>(
      'SELECT COUNT(*) as "total" FROM "EntitySchema"',
    )
    const total = Number(totalQueryResult[0].total)

    const rawResult = await this.dbQuery<EntitySchemaType>(
      `
      SELECT * FROM "EntitySchema"
      OFFSET $1 LIMIT $2
    `,
      [offset, limit],
    )

    const fields = await this.dbQuery<SchemaFieldType>(
      `
      SELECT * FROM "SchemaField"
      WHERE "entitySchemaId" = ANY($1)
    `,
      [rawResult.map(({ id }) => id)],
    )

    const result: EntitySchema[] = rawResult.map((schema) =>
      this.mapFieldsToRawSchema(schema, fields),
    )

    return {
      offset,
      limit,
      total,
      result,
    }
  }

  public async getOne(entitySchemaId: string): Promise<EntitySchema | null> {
    const [rawEntitySchema] = await this.dbQuery<EntitySchemaType>(
      `
      SELECT * FROM "EntitySchema"
      WHERE "id" = $1
    `,
      [entitySchemaId],
    )

    const fields = await this.dbQuery<SchemaFieldType>(
      `
      SELECT * FROM "SchemaField"
      WHERE "entitySchemaId" = $1
    `,
      [entitySchemaId],
    )

    return this.mapFieldsToRawSchema(rawEntitySchema, fields)
  }

  public async createOne(
    partialSchema: Partial<EntitySchema>,
  ): Promise<EntitySchema | null> {
    if (!partialSchema.name) {
      return null
    }
    const [rawEntitySchema] = await this.dbQuery<EntitySchemaType>(
      `
      INSERT INTO "EntitySchema"(name) values ($1)
      RETURNING *
    `,
      [partialSchema.name],
    )

    const fieldsToCreate = Object.keys(partialSchema)
      .filter((key) => {
        const fieldTypes: string[] = Object.values(FieldType)
        return fieldTypes.includes(partialSchema[key] ?? '')
      })
      .map((key) => ({
        fieldName: key,
        type: (partialSchema[key] || '') as FieldType,
      }))
    this.createSchemaFields(fieldsToCreate, rawEntitySchema.id)
    return this.getOne(rawEntitySchema.id)
  }

  public async updateOne(
    entitySchemaId: string,
    partialSchema: Partial<EntitySchema>,
  ): Promise<EntitySchema | null> {
    const [existingSchema] = await this.dbQuery<EntitySchemaType>(
      'SELECT * FROM "EntitySchema" WHERE "id" = $1',
      [entitySchemaId],
    )
    if (!existingSchema) {
      return null
    }
    const existingFields = await this.dbQuery<SchemaFieldType>(
      'SELECT * FROM "SchemaField" where "entitySchemaId" = $1',
      [entitySchemaId],
    )

    const fieldIdsToDelete = existingFields
      .filter((field) => !partialSchema[field.fieldName])
      .map(({ id }) => id)
    await this.deleteFieldListByFieldIds(fieldIdsToDelete)
    const fieldsToCreate = Object.keys(partialSchema)
      .filter(
        (key) => !existingFields.find(({ fieldName }) => fieldName === key),
      )
      .filter((key) => !((partialSchema[key] || '') in FieldType))
      .map((key) => ({
        fieldName: key,
        type: (partialSchema[key] || '') as FieldType,
      }))
    await this.createSchemaFields(fieldsToCreate, entitySchemaId)
    await this.dbQuery(
      'UPDATE "EntitySchema" set "updatedAt" = current_timestamp(0) WHERE "id" = $1',
      [entitySchemaId],
    )
    return this.getOne(entitySchemaId)
  }

  public async deleteOne(entitySchemaId: string): Promise<void> {
    await this.dbQuery('DELETE FROM "EntitySchema" WHERE "id" = $1', [
      entitySchemaId,
    ])
  }

  private async deleteFieldListByFieldIds(fieldIds: string[]): Promise<void> {
    await this.dbQuery('DELETE FROM "SchemaField" WHERE "id" = ANY($1)', [
      fieldIds,
    ])
  }

  private async createSchemaFields(
    fields: { fieldName: string; type: FieldType }[],
    entitySchemaId: string,
  ): Promise<void> {
    const parametersInsertionString = fields
      .map(
        (_, index) =>
          `($${2 * index + 1}, $${2 * index + 2}, '${entitySchemaId}')`,
      )
      .join(', ')
    await this.dbQuery<object>(
      `
      INSERT INTO "SchemaField"("fieldName", "type", "entitySchemaId") 
      VALUES ${parametersInsertionString}
    `,
      fields.flatMap(({ fieldName, type }) => [fieldName, type]),
    )
  }

  private mapFieldsToRawSchema(
    rawSchema: EntitySchemaType,
    fields: SchemaFieldType[],
  ): EntitySchema {
    const fieldParts = fields
      .filter(({ entitySchemaId }) => entitySchemaId === rawSchema.id)
      .map(({ fieldName, type }) => ({ [fieldName]: type }))
    return Object.assign({}, rawSchema, ...fieldParts)
  }
}
