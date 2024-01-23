import { appConfig } from '../../src/config'
import { EntitySchema } from '../../src/entity'
import { Request } from '../../src/utils/http-request'

const address = `http://localhost:${appConfig.port}`

describe('Entity API', () => {
  test('should create schema', async () => {
    const { body: userSchema } = await Request.post<EntitySchema>(`${address}/schema`, {
      name: 'users',
      firstName: 'string',
      lastName: 'string',
      age: 'number',
      isAuthorized: 'boolean',
    })
    expect(userSchema).toBeTruthy()
  })
})