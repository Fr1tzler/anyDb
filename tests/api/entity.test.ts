import { appConfig } from '../../src/config'
import { Entity, EntitySchema } from '../../src/entity'
import { EntityRoutes, SchemaRoutes } from '../../src/routes'
import { Request } from '../../src/utils/http-request'
import { IListAllResponse } from '../../src/utils/types'

const schemaAddress = `http://localhost:${appConfig.port}${SchemaRoutes.basePath}`
const entityAddress = `http://localhost:${appConfig.port}${EntityRoutes.basePath}`

describe('Entity API', () => {
  test('should create schema', async () => {
    const { body: userSchema } = await Request.post<EntitySchema>(
      `${schemaAddress}${SchemaRoutes.routes.createOne()}`,
      {
        name: 'users',
        firstName: 'string',
        lastName: 'string',
        age: 'number',
        isAuthorized: 'boolean',
      })
    expect(userSchema).toBeTruthy()

    const { body: entityListBeforeCreate } = await Request.get<IListAllResponse<Entity>>(
      `${entityAddress}${EntityRoutes.routes.listAllBySchemaId(userSchema.id)}`,
    )

    expect(entityListBeforeCreate.result.length).toBe(0)

    const userPayload = {
      firstName: 'John',
      lastName: 'Doe',
      age: 21,
      entitySchemaId: userSchema.id
    }

    const { body: createdUser } = await Request.post<Entity>(
      `${entityAddress}${EntityRoutes.routes.createOne()}`,
      userPayload
    )

    expect(createdUser.firstName).toBe('John')
    expect(createdUser.lastName).toBe('Doe')

    const { body: entityListAfterCreate } = await Request.get<IListAllResponse<Entity>>(
      `${entityAddress}${EntityRoutes.routes.listAllBySchemaId(userSchema.id)}`,
    )

    expect(entityListAfterCreate.result.length).toBe(1)

    await Request.put(`${entityAddress}${EntityRoutes.routes.updateOne(createdUser.id)}`, { age: 22 })

    const { body: userAfterUpdate } = await Request.get<Entity>(
      `${entityAddress}${EntityRoutes.routes.getOne(createdUser.id)}`
    )

    expect(userAfterUpdate.age).toBe(22)

    await Request.put(
      `${schemaAddress}${SchemaRoutes.routes.updateOne(userSchema.id)}`, {
        firstName: 'string',
        lastName: 'string',
      }
    )

    const { body: userAfterSchemaUpdate } = await Request.get<Entity>(
      `${entityAddress}${EntityRoutes.routes.getOne(userAfterUpdate.id)}`
    )
    expect(userAfterSchemaUpdate.age).toBeUndefined()

    await Request.delete(`${schemaAddress}${SchemaRoutes.routes.deleteOne(userSchema.id)}`)
  })
})