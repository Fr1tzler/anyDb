import { BaseRepository, getBaseRepository } from '../../src/repository/memory/base.repository'
import { EntitySchemaType, EntityType, FieldType, FieldValueType, SchemaFieldType } from '../../src/types'

const now = new Date().toISOString()
const dateParams = {
  createdAt: now,
  updatedAt: now,
}
const entitySchema: EntitySchemaType = {
  id: 'es1',
  name: 'entitySchema',
  ...dateParams
}
const entity: EntityType = {
  id: 'e1',
  schemaId: entitySchema.id,
  ...dateParams,
}
const schemaField: SchemaFieldType = {
  id: 's1',
  fieldName: 'booleanValue',
  type: FieldType.BOOLEAN,
  entitySchemaId: entitySchema.id,
  ...dateParams
}
const fieldValue: FieldValueType = {
  id: 'fv1',
  schemaId: entitySchema.id,
  schemaFieldId: schemaField.id,
  entityId: entity.id,
  booleanValue: true,
  type: FieldType.BOOLEAN,
  ...dateParams,
}

const fillBaseRepository = (repository: BaseRepository) => {
  repository.entitySchemaList = [entitySchema]
  repository.entityList = [entity]
  repository.schemaFieldList = [schemaField]
  repository.fieldValueList = [fieldValue]
}

const clearBaseRepository = (repository: BaseRepository) => {
  repository.entitySchemaList = []
  repository.entityList = []
  repository.schemaFieldList = []
  repository.fieldValueList = []
}

describe('Base repository', () => {
  const repository = getBaseRepository()

  test('Initalization successful', () => {
    expect(repository).toBeDefined()
    expect(repository.entityList).toHaveLength(0)
    expect(repository.entitySchemaList).toHaveLength(0)
    expect(repository.fieldValueList).toHaveLength(0)
    expect(repository.schemaFieldList).toHaveLength(0)  
  })

  test('Entity creation successful', () => {
    fillBaseRepository(repository)
    expect(repository.entitySchemaList).toHaveLength(1)
    expect(repository.entityList).toHaveLength(1)
    expect(repository.schemaFieldList).toHaveLength(1)
    expect(repository.fieldValueList).toHaveLength(1)
  })

  test('Schema deletion successful', () => {
    fillBaseRepository(repository)
    repository.entitySchemaList = []   
    expect(repository.entitySchemaList).toHaveLength(0)
    expect(repository.entityList).toHaveLength(0)
    expect(repository.schemaFieldList).toHaveLength(0)
    expect(repository.fieldValueList).toHaveLength(0)
    clearBaseRepository(repository)
  })

  test('Entity deletion successful', () => {
    fillBaseRepository(repository)
    repository.entityList = []   
    expect(repository.entitySchemaList).toHaveLength(1)
    expect(repository.entityList).toHaveLength(0)
    expect(repository.schemaFieldList).toHaveLength(1)
    expect(repository.fieldValueList).toHaveLength(0)
    clearBaseRepository(repository)
  })

  test('Field deletion successful', () => {
    fillBaseRepository(repository)
    repository.schemaFieldList = []   
    expect(repository.entitySchemaList).toHaveLength(1)
    expect(repository.entityList).toHaveLength(1)
    expect(repository.schemaFieldList).toHaveLength(0)
    expect(repository.fieldValueList).toHaveLength(0)
    clearBaseRepository(repository)
  })

  test('Field value deletion successful', () => {
    fillBaseRepository(repository)
    repository.fieldValueList = []   
    expect(repository.entitySchemaList).toHaveLength(1)
    expect(repository.entityList).toHaveLength(1)
    expect(repository.schemaFieldList).toHaveLength(1)
    expect(repository.fieldValueList).toHaveLength(0)
    clearBaseRepository(repository)
  })
})
