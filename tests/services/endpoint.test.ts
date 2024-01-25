import { randomUUID } from 'crypto'
import { EndpointRepository } from '../../src/repository/endpoint.repository'
import { dbQuery } from '../../src/database/connection'
import { EndpointService } from '../../src/services/endpoint.service'
import { EntitySchemaService } from '../../src/services/entity-schema.service'
import { EntitySchemaRepository } from '../../src/repository/entity-schema.repository'

const entitySchemaRepository = new EntitySchemaRepository(dbQuery)
const entitySchemaService = new EntitySchemaService(entitySchemaRepository)
const endpointRepository = new EndpointRepository(dbQuery)
const endpointService = new EndpointService(endpointRepository)

describe('Endpoint service', () => {
  test('should perform CRUD', async () => {
    const endpointPath = randomUUID()
    const schema = await entitySchemaService.createOne({
      name: 'test',
      testField: 'string',
    })

    const createdEndpoint = await endpointService.createOne({
      path: endpointPath,
      entitySchemaId: schema.id,
      createOneEnabled: true,
      listAllEnabled: true,
      getOneEnabled: true,
      updateOneEnabled: true,
      deleteOneEnabled: true
    })
    expect(createdEndpoint).toBeTruthy()

    expect(createdEndpoint.listAllEnabled).toBe(true)

    await endpointService.updateOne(createdEndpoint.id, {
      listAllEnabled: false
    })
    const updatedEndpoint = await endpointService.getOne(createdEndpoint.id)

    expect(updatedEndpoint.listAllEnabled).toBe(false)

    await endpointService.deleteOne(createdEndpoint.id)
    await entitySchemaService.deleteOne(schema.id)
  })

  test('should list all', async () => {
    await endpointService.listAll()
  })
})