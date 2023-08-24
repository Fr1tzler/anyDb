import { getBaseRepository } from '../../src/repository/memory/base.repository'
import { EntitySchemaRepository } from '../../src/repository/memory/entity-schema.repository'
import { EntityRepository } from '../../src/repository/memory/entity.repository'
import { FieldType } from '../../src/types'

// just something like real-word object
const basicEntitySchema = {
  name: 'user',
  username: FieldType.STRING,
  password: FieldType.STRING,
  balance: FieldType.NUMBER,
  isAdmin: FieldType.BOOLEAN,
  locationInfo: FieldType.JSON,
}

// just something like real-word object
const basicEntity = {
  username: 'John Doe',
  password: 'hashedPassword',
  balance: 10,
  currency: 'RUB',
  isAdmin: false,
  locationInfo: {
    country: 'England',
    city: 'London',
  }
}



describe('Entity repository', () => {
  const baseRepository = getBaseRepository()
  const entitySchemaRepository = new EntitySchemaRepository(baseRepository)
  const schema = entitySchemaRepository.createOne(basicEntitySchema)
  const entityRepository = new EntityRepository(baseRepository)
  
  test('Skip entity w/o schemaId creation', () => {
    const nullishEntity = entityRepository.createOne(basicEntity)
  
    expect(nullishEntity).toBeNull()
  })

  test('Entity create', () => {
    const createdEntity = entityRepository.createOne({
      ...basicEntity,
      schemaId: schema?.id,
    })

    expect(createdEntity).toBeDefined()
    expect(createdEntity?.username).toBe('John Doe')
    expect(createdEntity?.password).toBe('hashedPassword')
    expect(createdEntity?.balance).toBe(10)
    expect(createdEntity?.currency).toBeUndefined()
    expect(createdEntity?.isAdmin).toBe(false)
    expect((createdEntity?.locationInfo as Record<string, unknown>)?.country).toBe('England')
    expect((createdEntity?.locationInfo as Record<string, unknown>)?.city).toBe('London')
  })

  test('Entity not found', () => {
    const notExistingEntity = entityRepository.getOne('')

    expect(notExistingEntity).toBeNull()
  })

  test('EntityList', () => {
    const entityListObject = entityRepository.listAll()

    expect(entityListObject.result).toHaveLength(1)
    expect(entityListObject.total).toBe(1)
  })

  test('Skip on not existing existing entity update', () => {
    const updateResult = entityRepository.updateOne('', {
      username: 'Jane Doe'
    })

    expect(updateResult).toBe(null)
  })

  test('Entity update', () => {
    const entityListObject = entityRepository.listAll()
    const { id } = entityListObject.result[0]

    const updatedEntity = entityRepository.updateOne(id, { 
      username: 'Jane Doe'
    })

    expect(updatedEntity).toBeDefined()
    expect(updatedEntity?.username).toBe('Jane Doe')
  })

  test('Entity delete', () => {
    const entityListObject = entityRepository.listAll()   
    const { id } = entityListObject.result[0]

    entityRepository.deleteOne(id)
    expect(baseRepository.entityList).toHaveLength(0)
    expect(baseRepository.fieldValueList).toHaveLength(0)
  })
})
