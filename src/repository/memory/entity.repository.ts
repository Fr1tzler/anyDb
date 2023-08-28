import { randomUUID } from 'crypto'
import { Entity } from '../../entity/entity.entity'
import { EntityType, FieldType, SchemaFieldType } from '../../types'
import {
  EntityFieldValueType,
  FieldValueType,
  RecordType,
  fieldIsBoolean,
  fieldIsNumber,
  fieldIsObject,
  fieldIsString,
} from '../../types/field-value.type'
import { IListAllResponse } from '../../utils/types'
import { BaseRepository } from './base.repository'

interface EntityListAllQuery {
  orderBy: string;
  order: 'asc' | 'desc';
  where: {
    field: string;
    value: EntityFieldValueType;
  };
}

interface IOtherFields {
  id: string;
  createdAt: string;
  updatedAt: string;
  schemaId: string;
  schemaFieldId: string;
  entityId: string;
}

export interface IEntityRepository {
  createOne(partialEntity: Partial<Entity>): Entity | null;
  listAll(
    offset?: number,
    limit?: number,
    query?: EntityListAllQuery,
  ): IListAllResponse<Entity>;
  getOne(id: string): Entity | null;
  updateOne(id: string, partialEntity: Partial<Entity>): Entity | null;
  deleteOne(id: string): void;
}

export class EntityRepository implements IEntityRepository {
  constructor(private baseRepository: BaseRepository) {}

  // todo refactor
  public createOne(partialEntity: Partial<Entity>): Entity | null {
    if (!partialEntity.schemaId) {
      return null
    }
    const fields = this.getFieldsBySchemaIds([partialEntity.schemaId])

    const entityFieldsToCreate: FieldValueType[] = []

    const now = new Date().toISOString()

    const entity: EntityType = {
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      schemaId: partialEntity.schemaId,
    }

    for (const field of fields) {
      const value = partialEntity[field.fieldName]
      if (!value && value !== false) {
        continue
      }
      const otherFields = {
        id: randomUUID(),
        createdAt: now,
        updatedAt: now,
        schemaId: partialEntity.schemaId,
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
    this.baseRepository.entityList = [
      ...this.baseRepository.entityList,
      entity,
    ]
    this.baseRepository.fieldValueList = [
      ...this.baseRepository.fieldValueList,
      ...entityFieldsToCreate,
    ]
    return this.getOne(entity.id)
  }

  // todo implement query
  public listAll(
    offset: number = 0,
    limit: number = 20,
  ): IListAllResponse<Entity> {
    const total = this.baseRepository.entityList.length
    const rawResult = this.baseRepository.entityList.slice(
      offset,
      offset + limit,
    )
    const uniqueSchemaIds = [
      ...new Set(rawResult.map(({ schemaId }) => schemaId)),
    ]
    const entityIds = rawResult.map(({ id }) => id)
    const allFields = this.getFieldsBySchemaIds(uniqueSchemaIds)
    const allFieldValues = this.getFieldValuesByEntityIds(entityIds)

    const result: Entity[] = rawResult.map((entityBase) => {
      const fields = allFields.filter(
        ({ entitySchemaId }) => entitySchemaId === entityBase.schemaId,
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

  public getOne(entityId: string): Entity | null {
    const entityBase = this.baseRepository.entityList.find(
      ({ id }) => id === entityId,
    )
    if (!entityBase) {
      return null
    }
    const fieldValues = this.getFieldValuesByEntityIds([entityBase.id])
    const fields = this.getFieldsBySchemaIds([entityBase.schemaId])
    return this.mapFieldsToEntity(entityBase, fields, fieldValues)
  }

  public updateOne(
    entityId: string,
    partialEntity: Partial<Entity>,
  ): Entity | null {
    const entityToUpdate = this.baseRepository.entityList.find(
      ({ id }) => id === entityId,
    )
    if (!entityToUpdate) {
      return null
    }
    const fields = this.getFieldsBySchemaIds([entityToUpdate.schemaId])
    const fieldValuesToCreate: FieldValueType[] = []
    const fieldValueFieldIdsToDelete: string[] = []
    const now = new Date().toISOString()

    for (const field of fields) {
      const value = partialEntity[field.fieldName]
      if (!value && value !== false) {
        continue
      }
      fieldValueFieldIdsToDelete.push(field.id)
      const otherFields = {
        id: randomUUID(),
        createdAt: now,
        updatedAt: now,
        schemaId: entityToUpdate.schemaId,
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

    this.baseRepository.fieldValueList =
      this.baseRepository.fieldValueList.filter(
        (fieldValue) =>
          !(
            fieldValue.entityId === entityId &&
            fieldValueFieldIdsToDelete.includes(fieldValue.schemaFieldId)
          ),
      )
    this.baseRepository.fieldValueList = [
      ...this.baseRepository.fieldValueList,
      ...fieldValuesToCreate,
    ]

    return this.getOne(entityId)
  }

  public deleteOne(entityId: string): void {
    this.baseRepository.entityList = this.baseRepository.entityList.filter(
      ({ id }) => id !== entityId,
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

  private getFieldsBySchemaIds(schemaIds: string[]) {
    return this.baseRepository.schemaFieldList.filter(({ entitySchemaId }) =>
      schemaIds.includes(entitySchemaId),
    )
  }

  private getFieldValuesByEntityIds(entityIds: string[]) {
    return this.baseRepository.fieldValueList.filter(({ entityId }) =>
      entityIds.includes(entityId),
    )
  }

  private getFieldValueFromObjectField(
    field: SchemaFieldType,
    value: EntityFieldValueType,
    otherFields: IOtherFields,
  ): FieldValueType | null {
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
