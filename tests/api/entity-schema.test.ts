import { appConfig } from '../../src/config'
import { EntitySchema } from '../../src/entity'
import { Request } from '../../src/utils/http-request'

const address = `http://localhost:${appConfig.port}`

describe('Schema API', () => {
  test('should create schema', async () => {
    const { body: createdSchema } = await Request.post<EntitySchema>(`${address}/schema`, {
      name: 'test',
      testField1: 'string',
      testField2: 'number',
      testField3: 'boolean',
      testField4: 'object',
    })
    expect(createdSchema).toBeTruthy()
    const { id } = createdSchema

    const { body: schemaFromDb } = await Request.get<EntitySchema>(`${address}/schema/${id}`)

    expect(createdSchema).toStrictEqual(schemaFromDb)

    await Request.delete(`${address}/schema/${id}`)
  })

  test('should get all schemas', async () => {
    await Request.get(`${address}/schema`)
  })
})