import { EntitySchemaApi } from '../api/entity-schema.api'
import { EntityApi } from '../api/entity.api'

describe('Entity API', () => {
  test('should create schema', async () => {
    const userSchema = await EntitySchemaApi.create({
      name: 'users',
      firstName: 'string',
      lastName: 'string',
      age: 'number',
      isAuthorized: 'boolean',
    })

    const entityListBeforeCreate = await EntityApi.listAllBySchemaId(userSchema.id)
    expect(entityListBeforeCreate.result.length).toBe(0)

    const userPayload = {
      firstName: 'John',
      lastName: 'Doe',
      age: 21,
      entitySchemaId: userSchema.id
    }

    const createdUser = await EntityApi.create(userPayload)
    expect(createdUser.firstName).toBe('John')
    expect(createdUser.lastName).toBe('Doe')

    const entityListAfterCreate = await EntityApi.listAllBySchemaId(userSchema.id)
    expect(entityListAfterCreate.result.length).toBe(1)

    await EntityApi.put(createdUser.id, { age: 22 })

    const userAfterUpdate = await EntityApi.get(createdUser.id)
    expect(userAfterUpdate.age).toBe(22)

    await EntitySchemaApi.put(userSchema.id, {
      firstName: 'string',
      lastName: 'string',
    })

    const userAfterSchemaUpdate = await EntityApi.get(userAfterUpdate.id)
    expect(userAfterSchemaUpdate.age).toBeUndefined()

    await EntityApi.delete(userAfterSchemaUpdate.id)

    const entityListAfterEntityDelete = await EntityApi.listAllBySchemaId(userSchema.id)
    expect(entityListAfterEntityDelete.result.length).toBe(0)

    await EntitySchemaApi.delete(userSchema.id)
  })
})