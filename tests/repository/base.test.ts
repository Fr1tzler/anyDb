import { getBaseRepository } from '../../src/repository/base.repository'
import { EntitySchemaType, EntityType, FieldType, FieldValueType, SchemaFieldType } from '../../src/types'

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
      type: FieldType.BOOLEN,
      entitySchemaId: entitySchema.id,
      ...dateParams
    }
    const fieldValue: FieldValueType = {
      id: 'fv1',
      schemaId: entitySchema.id,
      schemaFieldId: schemaField.id,
      entityId: entity.id,
      boolenValue: true,
      ...dateParams,
    }

    repository.entitySchemaList = [entitySchema]
    repository.entityList = [entity]
    repository.schemaFieldList = [schemaField]
    repository.fieldValueList = [fieldValue]

    expect(repository.entitySchemaList).toHaveLength(1)
    expect(repository.entityList).toHaveLength(1)
    expect(repository.schemaFieldList).toHaveLength(1)
    expect(repository.fieldValueList).toHaveLength(1)
  })

  test('Entity deletion successful', () => {
    repository.entitySchemaList = []   
    expect(repository.entitySchemaList).toHaveLength(0)
    expect(repository.entityList).toHaveLength(0)
    expect(repository.schemaFieldList).toHaveLength(0)
    expect(repository.fieldValueList).toHaveLength(0)
  })
})
