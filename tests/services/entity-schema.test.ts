import { dbQuery } from '../../src/database/connection'
import { EntitySchemaRepository } from '../../src/repository/entity-schema.repository'
import { EntitySchemaService } from '../../src/services/entity-schema.service'

const entitySchemaRepository = new EntitySchemaRepository(dbQuery)
const entitySchemaService = new EntitySchemaService(entitySchemaRepository)

describe('Schema service', () => {
  test('should create schema', async () => {
    const createdSchema = await entitySchemaService.createOne({
      name: 'test',
      testField1: 'string',
      testField2: 'number',
      testField3: 'boolean',
      testField4: 'object',
    })
    expect(createdSchema).toBeTruthy()
    const { id } = createdSchema

    const schemaFromDb = await entitySchemaService.getOne(id)

    expect(createdSchema).toStrictEqual(schemaFromDb)

    await entitySchemaService.deleteOne(id)
  })

  test('should get all schemas', async () => {
    await entitySchemaService.listAll()
  })
})