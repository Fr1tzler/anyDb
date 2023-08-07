import { EntitySchema } from '../entity'
import { EntitySchemaType, SchemaFieldType } from '../types'

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
    const fields = this.schemaFieldList.filter(({ entitySchemaId }) => entitySchemaIds.includes(entitySchemaId))
    const result: EntitySchema[] = rawResult.map(rawEntitySchema => this.mapFieldsToRawSchema(rawEntitySchema, fields))

    return {
      offset,
      limit,
      total,
      result,
    }
  }

  private mapFieldsToRawSchema = (rawSchema: EntitySchemaType, fields: SchemaFieldType[]): EntitySchema => {
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