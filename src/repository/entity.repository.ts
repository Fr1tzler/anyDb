import { Entity } from '../entity/entity.entity'
import { EntityType, FieldType, SchemaFieldType } from '../types'
import {
  EntityFieldValueType,
  FieldValueType,
  RecordType,
  fieldIsBoolean,
  fieldIsNumber,
  fieldIsObject,
  fieldIsString,
} from '../types'
import { IListAllResponse } from '../utils/types'
import { DbQueryExecutor } from '../database/types'

interface IOtherFields {
  entitySchemaId: string;
  schemaFieldId: string;
  entityId: string;
}

export interface IEntityRepository {
  createOne(partialEntity: Partial<Entity>): Promise<Entity | null>;
  listAll(offset?: number, limit?: number): Promise<IListAllResponse<Entity>>;
  getOne(id: string): Promise<Entity | null>;
  updateOne(id: string, partialEntity: Partial<Entity>): Promise<Entity | null>;
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

  // todo refactor
  public async createOne(
    partialEntity: Partial<Entity>,
  ): Promise<Entity | null> {
    if (!partialEntity.entitySchemaId) {
      return null
    }
    const fields = await this.getFieldsBySchemaIds([partialEntity.entitySchemaId])

    const entityFieldsToCreate: Partial<FieldValueType>[] = []

    const [entity] = await this.dbQuery<EntityType>(
      'INSERT INTO "Entity"("entitySchemaId") VALUES ($1) RETURNING *',
      [partialEntity.entitySchemaId],
    )

    for (const field of fields) {
      const value = partialEntity[field.fieldName]
      if (!value && value !== false) {
        continue
      }
      const otherFields = {
        entitySchemaId: partialEntity.entitySchemaId,
        schemaFieldId: field.id,
        entityId: entity.id,
      }
      const fieldValueObject = this.getFieldValueFromObjectField(
        field,
        value,
        otherFields,
      )
      if (fieldValueObject) {
        entityFieldsToCreate.push(fieldValueObject)
      }
    }
    await this.createEntityFields(entityFieldsToCreate)
    return this.getOne(entity.id)
  }

  // todo implement query
  public async listAll(
    offset: number = 0,
    limit: number = 20,
  ): Promise<IListAllResponse<Entity>> {
    const totalResult = await this.dbQuery<{ count: string }>(
      'SELECT COUNT(*) AS "count" FROM "Entity"',
    )
    const total = Number(totalResult[0].count)
    const rawResult = await this.dbQuery<EntityType>(
      'SELECT * FROM "Entity" OFFSET $1 LIMIT $1',
      [offset, limit],
    )
    const uniqueSchemaIds = [
      ...new Set(rawResult.map(({ entitySchemaId }) => entitySchemaId)),
    ]
    const entityIds = rawResult.map(({ id }) => id)
    const allFields = await this.getFieldsBySchemaIds(uniqueSchemaIds)
    const allFieldValues = await this.getFieldValuesByEntityIds(entityIds)

    const result: Entity[] = rawResult.map((entityBase) => {
      const fields = allFields.filter(
        ({ entitySchemaId }) => entitySchemaId === entityBase.entitySchemaId,
      )
      const fieldValues = allFieldValues.filter(
        ({ entityId }) => entityId === entityBase.id,
      )
      return this.mapFieldsToEntity(entityBase, fields, fieldValues)
    })

    return {
      offset,
      limit,
      total,
      result,
    }
  }

  public async getOne(entityId: string): Promise<Entity | null> {
    const [entityBase] = await this.dbQuery<EntityType>(
      'SELECT * FROM "Entity" WHERE "id" = $1',
      [entityId],
    )
    if (!entityBase) {
      return null
    }

    const fields = await this.getFieldsBySchemaIds([entityBase.entitySchemaId])
    const fieldValues = await this.getFieldValuesByEntityIds([entityBase.id])

    return this.mapFieldsToEntity(entityBase, fields, fieldValues)
  }

  public async updateOne(
    entityId: string,
    partialEntity: Partial<Entity>,
  ): Promise<Entity | null> {
    const [entityToUpdate] = await this.dbQuery<EntityType>(
      'SELECT * FROM "Entity" WHERE "id" = $1',
      [entityId],
    )
    if (!entityToUpdate) {
      return null
    }
    const fields = await this.getFieldsBySchemaIds([entityToUpdate.entitySchemaId])
    const fieldValuesToCreate: Partial<FieldValueType>[] = []
    const fieldValueFieldIdsToDelete: string[] = []

    for (const field of fields) {
      const value = partialEntity[field.fieldName]
      if (!value && value !== false) {
        continue
      }
      fieldValueFieldIdsToDelete.push(field.id)
      const otherFields = {
        entitySchemaId: entityToUpdate.entitySchemaId,
        schemaFieldId: field.id,
        entityId,
      }
      const fieldValueToCreate = this.getFieldValueFromObjectField(
        field,
        value,
        otherFields,
      )
      if (fieldValueToCreate) {
        fieldValuesToCreate.push(fieldValueToCreate)
      }
    }

    await this.dbQuery(
      'UPDATE "Entity" SET "updatedAt" = current_timestamp(0) WHERE "id" = $1',
      [entityId],
    )
    await this.dbQuery(
      'DELETE FROM "FieldValue" WHERE "entityId" = $1 AND "schemaFieldId" = ANY($2)',
      [entityId, fieldValueFieldIdsToDelete],
    )
    await this.createEntityFields(fieldValuesToCreate)

    return this.getOne(entityId)
  }

  public async deleteOne(entityId: string): Promise<void> {
    await this.dbQuery('DELETE FROM "Entity" WHERE "id" = $1', [entityId])
  }

  // todo refactor
  private async createEntityFields(
    fieldValues: Partial<FieldValueType>[],
  ): Promise<void> {
    const parametersInsertionString = fieldValues
      .map(
        (_, index) => `(
      $${8 * index + 1}, 
      $${8 * index + 2}, 
      $${8 * index + 3}, 
      $${8 * index + 4}, 
      $${8 * index + 5}, 
      $${8 * index + 6}, 
      $${8 * index + 7}, 
      $${8 * index + 8} 
    )`,
      )
      .join(', ')
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
      result[field.fieldName] = this.getValueFromFieldValue(fieldValue)
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

  private async getFieldValuesByEntityIds(entityIds: string[]) {
    return await this.dbQuery<FieldValueType>(
      'SELECT * FROM "FieldValue" where "entityId" = ANY($1)',
      [entityIds],
    )
  }

  private getFieldValueFromObjectField(
    field: SchemaFieldType,
    value: EntityFieldValueType,
    otherFields: IOtherFields,
  ): Partial<FieldValueType> | null {
    if (field.type === FieldType.BOOLEAN) {
      return {
        booleanValue: Boolean(value),
        ...otherFields,
        type: field.type,
      }
    }
    if (field.type === FieldType.NUMBER) {
      return {
        numberValue: Number(value),
        ...otherFields,
        type: field.type,
      }
    }
    if (field.type === FieldType.STRING) {
      return {
        stringValue: String(value),
        ...otherFields,
        type: field.type,
      }
    }
    if (field.type === FieldType.JSON) {
      return {
        objectValue: value as RecordType,
        ...otherFields,
        type: field.type,
      }
    }
    return null
  }

  private getValueFromFieldValue(
    input: FieldValueType | null,
  ): EntityFieldValueType {
    if (!input) {
      return null
    }
    if (fieldIsBoolean(input)) {
      return input.booleanValue
    }
    if (fieldIsNumber(input)) {
      return input.numberValue
    }
    if (fieldIsString(input)) {
      return input.stringValue
    }
    if (fieldIsObject(input)) {
      return input.objectValue
    }
    return null
  }
}
