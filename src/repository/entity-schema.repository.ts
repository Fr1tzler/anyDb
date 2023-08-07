import { EntitySchema } from '../entity'
import { EntitySchemaType, FieldType, SchemaFieldType } from '../types'
import { randomUUID } from 'crypto'

class EntitySchemaRepository {
  private entitySchemaList: EntitySchemaType[]
  private schemaFieldList: SchemaFieldType[]

  constructor () {
    this.entitySchemaList = []
    this.schemaFieldList = []
  }

  public listAll(offset = 0, limit = 100) {
    const total = this.entitySchemaList.length

    const rawResult = this.entitySchemaList.slice(offset, offset + limit)
    const entitySchemaIds = rawResult.map(({ id }) => id)
    const fields = this.getFieldListByEntitySchemaIds(entitySchemaIds)
    const result: EntitySchema[] = rawResult.map(rawEntitySchema => this.mapFieldsToRawSchema(rawEntitySchema, fields))

    return {
      offset,
      limit,
      total,
      result,
    }
  }

  public getOne(entitySchemaId: string): EntitySchema | null {
    const schema = this.entitySchemaList.find(({ id }) => id === entitySchemaId)
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
    const schemaId = randomUUID()
    const schema: EntitySchemaType = {
      id: schemaId,
      name: partialSchema.name,
      createdAt: now,
      updatedAt: now,
    }
    this.entitySchemaList.push(schema)
    const fieldsToCreate = Object.keys(partialSchema)
      .filter(key => !((partialSchema[key] || '') in FieldType))
      .map(key => ({ fieldName: key, type: (partialSchema[key] || '') as FieldType }))
    this.createSchemaFields(fieldsToCreate, schemaId)
    return this.getOne(schemaId)
  }

  public updateOne(schemaId: string, partialSchema: Partial<EntitySchema>): EntitySchema | null {
    const indexToUpdate = this.entitySchemaList.findIndex(({ id }) => id === schemaId)
    if (indexToUpdate === -1) {
      return null
    }
    const existingFields = this.getFieldListByEntitySchemaIds([schemaId])
    // todo check id existing field type has been changed
    const fieldIdsToDelete = existingFields
      .filter(field => !partialSchema[field.fieldName])
      .map(({ id }) => id)
    this.deleteFieldListByFieldIds(fieldIdsToDelete)
    const fieldsToCreate = Object.keys(partialSchema)
      .filter(key => !existingFields.find(({ fieldName }) => fieldName === key))
      .filter(key => !((partialSchema[key] || '') in FieldType))
      .map(key => ({ fieldName: key, type: (partialSchema[key] || '') as FieldType }))
    this.createSchemaFields(fieldsToCreate, schemaId)
    this.entitySchemaList[indexToUpdate].updatedAt = new Date().toISOString()
    return this.getOne(schemaId)
  }

  public deleteOne(entitySchemaId: string) {
    this.entitySchemaList = this.entitySchemaList.filter(({ id }) => id !== entitySchemaId)
    this.deleteFieldListByEntitySchemaIds([entitySchemaId])

    // todo use foreign key with cascade delete for other tables
  }

  private createSchemaFields(fields: { fieldName: string; type: FieldType }[], entitySchemaId: string) {
    const now = new Date().toISOString()
    this.schemaFieldList.push(...fields.map(field => ({ 
      ...field,
      entitySchemaId,
      id: randomUUID(), 
      createdAt: now,
      updatedAt: now,
    })))
  }

  private deleteFieldListByEntitySchemaIds(entitySchemaIds: string[]) {
    this.schemaFieldList = this.schemaFieldList.filter(({ entitySchemaId }) => !entitySchemaIds.includes(entitySchemaId))
  }

  private deleteFieldListByFieldIds(schemaFieldIds: string[]) {
    this.schemaFieldList = this.schemaFieldList.filter(({ id }) => !schemaFieldIds.includes(id))
  }

  private getFieldListByEntitySchemaIds(entitySchemaIds: string[]): SchemaFieldType[] {
    return this.schemaFieldList.filter(({ entitySchemaId }) => entitySchemaIds.includes(entitySchemaId))
  }

  private mapFieldsToRawSchema(rawSchema: EntitySchemaType, fields: SchemaFieldType[]): EntitySchema {
    const fieldParts = fields
      .filter(({ entitySchemaId }) => entitySchemaId === rawSchema.id)
      .map(({ fieldName, type }) => ({ [fieldName]: type }))
    return Object.assign({}, rawSchema, ...fieldParts)
  }
}

let repository: EntitySchemaRepository | null = null

export const getRepository = () => {
  if (!repository) {
    repository = new EntitySchemaRepository()
  }
  return repository
}