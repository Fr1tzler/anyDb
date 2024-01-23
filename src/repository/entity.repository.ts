import { Entity } from '../entity/entity.entity'
import { EntityType, SchemaFieldType } from '../types'
import { FieldValueType } from '../types'
import { IListAllResponse } from '../utils/types'
import { DbQueryExecutor } from '../database/types'
import { generateDbParametersList } from '../utils/db-utils'
import { filterByFieldValue, getUniqueArrayValues, mapArrayToArrayKeys } from '../utils/array'
import { getFieldValueFromObjectField, getValueFromFieldValue } from '../utils/field-value'

export interface IEntityRepository {
  createOne(partialEntity: Partial<Entity>): Promise<Entity>;
  updateOne(id: string, partialEntity: Partial<Entity>): Promise<Entity>;
  listAllBySchemaId(schemaId: string,offset?: number, limit?: number): Promise<IListAllResponse<Entity>>;
  getOne(id: string): Promise<Entity>;
  deleteOne(id: string): Promise<void>;
}

type FieldValueValues = {
  booleanValue?: boolean;
  numberValue?: number;
  stringValue?: string;
  objectValue?: Record<string, unknown>;
};

export class EntityRepository implements IEntityRepository {
  constructor(private dbQuery: DbQueryExecutor) {}

  public async createOne(
    partialEntity: Partial<Entity>,
  ): Promise<Entity> {
    if (!partialEntity.entitySchemaId) {
      throw new Error('entitySchemaId is required')
    }
    const [entity] = await this.dbQuery<EntityType>(
      'INSERT INTO "Entity"("entitySchemaId") VALUES ($1) RETURNING *',
      [partialEntity.entitySchemaId],
    )

    const fields = await this.getFieldsBySchemaIds([partialEntity.entitySchemaId])
    await this.syncronizeEntityFields(fields, partialEntity, entity.id, entity.entitySchemaId)

    return this.getOne(entity.id)
  }

  public async updateOne(
    entityId: string,
    partialEntity: Partial<Entity>,
  ): Promise<Entity> {
    const entityToUpdate = await this.getOne(entityId)

    const fields = await this.getFieldsBySchemaIds([entityToUpdate.entitySchemaId])
    await this.syncronizeEntityFields(fields, partialEntity, entityId, entityToUpdate.entitySchemaId)

    await this.dbQuery(
      'UPDATE "Entity" SET "updatedAt" = current_timestamp(0) WHERE "id" = $1',
      [entityId],
    )
    return this.getOne(entityId)
  }

  public async listAllBySchemaId(entitySchemaId: string, offset: number = 0, limit: number = 20) {
    const totalResult = await this.dbQuery<{ count: string }>(
      'SELECT COUNT(*) AS "count" FROM "Entity" WHERE "entitySchemaId" = $1',
      [entitySchemaId]
    )
    const total = Number(totalResult[0].count)
    const rawResult = await this.dbQuery<EntityType>(
      'SELECT * FROM "Entity" WHERE "entitySchemaId" = $3 OFFSET $1 LIMIT $2',
      [offset, limit, entitySchemaId]
    )
    const entityIds = mapArrayToArrayKeys(rawResult, 'id')
    const { allFields, allFieldValues } = await this.getFieldValuesForEntityList(entitySchemaId, entityIds)
    const result: Entity[] = rawResult.map((entityBase) => {
      const { fields, fieldValues } = this.filterFieldsByEntity(entityBase, allFields, allFieldValues)
      return this.mapFieldsToEntity(entityBase, fields, fieldValues)
    })
    return { offset, limit, total, result }
  }

  public async getOne(entityId: string): Promise<Entity> {
    const [entityBase] = await this.dbQuery<EntityType>(
      'SELECT * FROM "Entity" WHERE "id" = $1',
      [entityId],
    )
    if (!entityBase) {
      throw new Error('entity not found')
    }

    const { allFields, allFieldValues } = await this.getFieldValuesForEntityList(entityBase.entitySchemaId, [entityId])
    const { fields, fieldValues } = this.filterFieldsByEntity(entityBase, allFields, allFieldValues)
    return this.mapFieldsToEntity(entityBase, fields, fieldValues)
  }

  public async deleteOne(entityId: string): Promise<void> {
    await this.dbQuery('DELETE FROM "Entity" WHERE "id" = $1', [entityId])
  }

  private async syncronizeEntityFields(
    fields: SchemaFieldType[],
    partialEntity: Partial<Entity>,
    entityId: string, entitySchemaId: string
  ) {
    const fieldValuesToCreate: Partial<FieldValueType>[] = []
    const fieldValueFieldIdsToDelete: string[] = []

    for (const field of fields) {
      const value = partialEntity[field.fieldName]
      if (!value && value !== false) {
        continue
      }
      fieldValueFieldIdsToDelete.push(field.id)
      const otherFields = {
        entitySchemaId: entitySchemaId,
        schemaFieldId: field.id,
        entityId,
      }
      const fieldValueToCreate = getFieldValueFromObjectField(
        field,
        value,
        otherFields,
      )
      if (fieldValueToCreate) {
        fieldValuesToCreate.push(fieldValueToCreate)
      }
    }
    await this.dbQuery(
      'DELETE FROM "FieldValue" WHERE "entityId" = $1 AND "schemaFieldId" = ANY($2)',
      [entityId, fieldValueFieldIdsToDelete],
    )
    await this.createEntityFields(fieldValuesToCreate)
  }

  private async getFieldValuesForEntityList(schemaId: string | string[], entityIds: string[]) {
    const uniqueSchemaIds = Array.isArray(schemaId) ? getUniqueArrayValues(schemaId) : [schemaId]
    const allFields = await this.getFieldsBySchemaIds(uniqueSchemaIds)
    const allFieldValues = await this.dbQuery<FieldValueType>(
      'SELECT * FROM "FieldValue" where "entityId" = ANY($1)',
      [entityIds],
    )
    return { allFields, allFieldValues}
  }

  private filterFieldsByEntity(
    entityBase: EntityType, allFields: SchemaFieldType[], allFieldValues: FieldValueType[],
  ) {
    const fields = filterByFieldValue(allFields, 'entitySchemaId', entityBase.entitySchemaId)
    const fieldValues = filterByFieldValue(allFieldValues, 'entityId', entityBase.id)
    return { fields, fieldValues}
  }

  private async createEntityFields(
    fieldValues: Partial<FieldValueType>[],
  ): Promise<void> {
    const parametersInsertionString = generateDbParametersList(fieldValues.length, 8)
    await this.dbQuery<object>(
      `
      INSERT INTO "FieldValue"(
        "entitySchemaId",
        "schemaFieldId",
        "entityId",
        "booleanValue",
        "numberValue",
        "stringValue",
        "objectValue",
        "type"
      ) 
      VALUES ${parametersInsertionString}
    `,
      fieldValues
        .map((el) => el as FieldValueType & FieldValueValues)
        .flatMap((fieldValue) => [
          fieldValue.entitySchemaId ?? null,
          fieldValue.schemaFieldId ?? null,
          fieldValue.entityId ?? null,
          fieldValue.booleanValue ?? null,
          fieldValue.numberValue ?? null,
          fieldValue.stringValue ?? null,
          fieldValue.objectValue ?? null,
          fieldValue.type ?? null,
        ]),
    )
  }

  private mapFieldsToEntity(
    entityBase: EntityType,
    fields: SchemaFieldType[],
    fieldValues: FieldValueType[],
  ): Entity {
    const result: Entity = entityBase
    for (const field of fields) {
      const fieldValue =
        fieldValues.find((value) => value.schemaFieldId === field.id) ?? null
      result[field.fieldName] = getValueFromFieldValue(fieldValue)
    }
    return result
  }

  private async getFieldsBySchemaIds(
    schemaIds: string[],
  ): Promise<SchemaFieldType[]> {
    return await this.dbQuery<SchemaFieldType>(
      'SELECT * FROM "SchemaField" WHERE "entitySchemaId" = ANY($1)',
      [schemaIds],
    )
  }
}
