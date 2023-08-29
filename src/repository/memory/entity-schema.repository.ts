import { EntitySchema } from '../../entity'
import { EntitySchemaType, FieldType, SchemaFieldType } from '../../types'
import { randomUUID } from 'crypto'
import { BaseRepository } from './base.repository'
import { IListAllResponse } from '../../utils/types'

export interface IEntitySchemaRepository {
  listAll(offset?: number, limit?: number): IListAllResponse<EntitySchema>;
  getOne(entitySchemaId: string): EntitySchema | null;
  createOne(partialSchema: Partial<EntitySchema>): EntitySchema | null;
  updateOne(
    entitySchemaId: string,
    partialSchema: Partial<EntitySchema>,
  ): EntitySchema | null;
  deleteOne(entitySchemaId: string): void;
}

export class EntitySchemaRepository implements IEntitySchemaRepository {
  constructor(private baseRepository: BaseRepository) {}

  public listAll(offset = 0, limit = 100) {
    const total = this.baseRepository.entitySchemaList.length

    const rawResult = this.baseRepository.entitySchemaList.slice(
      offset,
      offset + limit,
    )
    const entitySchemaIds = rawResult.map(({ id }) => id)
    const fields = this.getFieldListByEntitySchemaIds(entitySchemaIds)
    const result: EntitySchema[] = rawResult.map((rawEntitySchema) =>
      this.mapFieldsToRawSchema(rawEntitySchema, fields),
    )

    return {
      offset,
      limit,
      total,
      result,
    }
  }

  public getOne(entitySchemaId: string) {
    const schema = this.baseRepository.entitySchemaList.find(
      ({ id }) => id === entitySchemaId,
    )
    if (!schema) {
      return null
    }
    const fields = this.getFieldListByEntitySchemaIds([entitySchemaId])
    return this.mapFieldsToRawSchema(schema, fields)
  }

  public createOne(partialSchema: Partial<EntitySchema>) {
    if (!partialSchema.name) {
      return null
    }
    const now = new Date().toISOString()
    const entitySchemaId = randomUUID()
    const schema: EntitySchemaType = {
      id: entitySchemaId,
      name: partialSchema.name,
      createdAt: now,
      updatedAt: now,
    }
    this.baseRepository.entitySchemaList.push(schema)
    const fieldsToCreate = Object.keys(partialSchema)
      .filter((key) => {
        const fieldTypes: string[] = Object.values(FieldType)
        return fieldTypes.includes(partialSchema[key] ?? '')
      })
      .map((key) => ({
        fieldName: key,
        type: (partialSchema[key] || '') as FieldType,
      }))
    this.createSchemaFields(fieldsToCreate, entitySchemaId)
    return this.getOne(entitySchemaId)
  }

  public updateOne(
    entitySchemaId: string,
    partialSchema: Partial<EntitySchema>,
  ): EntitySchema | null {
    const indexToUpdate = this.baseRepository.entitySchemaList.findIndex(
      ({ id }) => id === entitySchemaId,
    )
    if (indexToUpdate === -1) {
      return null
    }
    const existingFields = this.getFieldListByEntitySchemaIds([entitySchemaId])
    // todo check id existing field type has been changed
    const fieldIdsToDelete = existingFields
      .filter((field) => !partialSchema[field.fieldName])
      .map(({ id }) => id)
    this.deleteFieldListByFieldIds(fieldIdsToDelete)
    const fieldsToCreate = Object.keys(partialSchema)
      .filter(
        (key) => !existingFields.find(({ fieldName }) => fieldName === key),
      )
      .filter((key) => !((partialSchema[key] || '') in FieldType))
      .map((key) => ({
        fieldName: key,
        type: (partialSchema[key] || '') as FieldType,
      }))
    this.createSchemaFields(fieldsToCreate, entitySchemaId)
    this.baseRepository.entitySchemaList[indexToUpdate].updatedAt =
      new Date().toISOString()
    return this.getOne(entitySchemaId)
  }

  public deleteOne(entitySchemaId: string) {
    this.baseRepository.entitySchemaList =
      this.baseRepository.entitySchemaList.filter(
        ({ id }) => id !== entitySchemaId,
      )
    this.deleteFieldListByEntitySchemaIds([entitySchemaId])

    // todo use foreign key with cascade delete for other tables
  }

  private createSchemaFields(
    fields: { fieldName: string; type: FieldType }[],
    entitySchemaId: string,
  ) {
    const now = new Date().toISOString()
    this.baseRepository.schemaFieldList.push(
      ...fields.map((field) => ({
        ...field,
        entitySchemaId,
        id: randomUUID(),
        createdAt: now,
        updatedAt: now,
      })),
    )
  }

  private deleteFieldListByEntitySchemaIds(entitySchemaIds: string[]) {
    this.baseRepository.schemaFieldList =
      this.baseRepository.schemaFieldList.filter(
        ({ entitySchemaId }) => !entitySchemaIds.includes(entitySchemaId),
      )
  }

  private deleteFieldListByFieldIds(schemaFieldIds: string[]) {
    this.baseRepository.schemaFieldList =
      this.baseRepository.schemaFieldList.filter(
        ({ id }) => !schemaFieldIds.includes(id),
      )
  }

  private getFieldListByEntitySchemaIds(
    entitySchemaIds: string[],
  ): SchemaFieldType[] {
    return this.baseRepository.schemaFieldList.filter(({ entitySchemaId }) =>
      entitySchemaIds.includes(entitySchemaId),
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
