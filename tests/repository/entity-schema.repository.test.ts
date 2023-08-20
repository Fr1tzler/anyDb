import { getBaseRepository } from '../../src/repository/base.repository'
import { EntitySchemaRepository } from '../../src/repository/entity-schema.repository'
import { FieldType } from '../../src/types'

// just something like real-word object
const basicEntity = {
  name: 'user',
  username: FieldType.STRING,
  password: FieldType.STRING,
  balance: FieldType.NUMBER,
  isAdmin: FieldType.BOOLEN,

}

describe('Entity schema repository', () => {
  const baseRepository = getBaseRepository()
  const entitySchemaRepository = new EntitySchemaRepository(baseRepository)

  test('Skip entity w/o name creation', () => {
    const nullishEntity = entitySchemaRepository.createOne({
      ...basicEntity,
      name: undefined
    })

    expect(nullishEntity).toBeNull()
  })

  test('Entity create', () => {
    const createdEntity = entitySchemaRepository.createOne(basicEntity)
    
    expect(createdEntity).toBeDefined()
    expect(baseRepository.entitySchemaList).toHaveLength(1)
    expect(baseRepository.schemaFieldList).toHaveLength(4)
    expect(baseRepository.entityList).toHaveLength(0)
    expect(baseRepository.fieldValueList).toHaveLength(0)
  })

  test('Entity not found', () => {
    // pasing empty id to insure that repo will not return any schema
    const schema = entitySchemaRepository.getOne('')
    expect(schema).toBeNull()
  })

  test('Entity list', () => {
    const schemaListObject = entitySchemaRepository.listAll()
    
    expect(schemaListObject.result).toHaveLength(1)
    expect(schemaListObject.total).toBe(1)
  })

  test('Skip on not existing entity update', () => {
    const updateResult = entitySchemaRepository.updateOne('', {
      username: FieldType.STRING,
      password: FieldType.STRING,
    })
    expect(updateResult).toBeNull()
  })

  test('Entity update', () => {
    const schemaListObject = entitySchemaRepository.listAll()   
    const { id } = schemaListObject.result[0]

    const updateResult = entitySchemaRepository.updateOne(id, {
      username: FieldType.STRING,
      password: FieldType.STRING,
    })
    expect(updateResult).toBeDefined()
    expect(baseRepository.schemaFieldList).toHaveLength(2)
  })

  test('Entity delete', () => {
    const schemaListObject = entitySchemaRepository.listAll()   
    const { id } = schemaListObject.result[0]

    entitySchemaRepository.deleteOne(id)
    expect(baseRepository.entitySchemaList).toHaveLength(0)
    expect(baseRepository.schemaFieldList).toHaveLength(0)
  })
})
