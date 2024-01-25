import { dbQuery } from '../../../src/database/connection'
import { EntitySchemaRepository } from '../../../src/repository/entity-schema.repository'
import { EntityRepository } from '../../../src/repository/entity.repository'
import { EntitySchemaService } from '../../../src/services/entity-schema.service'
import { EntityService } from '../../../src/services/entity.service'

const entitySchemaRepository = new EntitySchemaRepository(dbQuery)
const entitySchemaService = new EntitySchemaService(entitySchemaRepository)
const entityRepository = new EntityRepository(dbQuery)
const entityService = new EntityService(entityRepository)

describe('Entity service', () => {
  test('should create schema', async () => {
    const userSchema = await entitySchemaService.createOne({
      name: 'users',
      firstName: 'string',
      lastName: 'string',
      age: 'number',
      isAuthorized: 'boolean',
    })

    const entityListBeforeCreate = await entityService.listAllBySchemaId(userSchema.id)
    expect(entityListBeforeCreate.result.length).toBe(0)

    const userPayload = {
      firstName: 'John',
      lastName: 'Doe',
      age: 21,
      entitySchemaId: userSchema.id
    }

    const createdUser = await entityService.createOne(userPayload)
    expect(createdUser.firstName).toBe('John')
    expect(createdUser.lastName).toBe('Doe')

    const entityListAfterCreate = await entityService.listAllBySchemaId(userSchema.id)
    expect(entityListAfterCreate.result.length).toBe(1)

    await entityService.updateOne(createdUser.id, { age: 22 })

    const userAfterUpdate = await entityService.getOne(createdUser.id)
    expect(userAfterUpdate.age).toBe(22)

    await entitySchemaService.updateOne(userSchema.id, {
      firstName: 'string',
      lastName: 'string',
    })

    const userAfterSchemaUpdate = await entityService.getOne(userAfterUpdate.id)
    expect(userAfterSchemaUpdate.age).toBeUndefined()

    await entityService.deleteOne(userAfterSchemaUpdate.id)

    const entityListAfterEntityDelete = await entityService.listAllBySchemaId(userSchema.id)
    expect(entityListAfterEntityDelete.result.length).toBe(0)

    await entitySchemaService.deleteOne(userSchema.id)
  })
})