import { EntitySchemaApi } from '../api/entity-schema.api'

describe('Schema API', () => {
  test('should create schema', async () => {
    const createdSchema = await EntitySchemaApi.create({
      name: 'test',
      testField1: 'string',
      testField2: 'number',
      testField3: 'boolean',
      testField4: 'object',
    })
    expect(createdSchema).toBeTruthy()
    const { id } = createdSchema

    const schemaFromDb = await EntitySchemaApi.get(id)

    expect(createdSchema).toStrictEqual(schemaFromDb)

    await EntitySchemaApi.delete(id)
  })

  test('should get all schemas', async () => {
    await EntitySchemaApi.listAll()
  })
})