import { randomUUID } from 'crypto'
import { EndpointApi } from '../api/endpoint.api'
import { EntitySchemaApi } from '../api/entity-schema.api'

describe('Endpoint API', () => {
  test('should perform CRUD', async () => {
    const endpointPath = randomUUID()
    const schema = await EntitySchemaApi.create({
      name: 'test',
      testField: 'string',
    })

    const createdEndpoint = await EndpointApi.create({
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

    await EndpointApi.put(createdEndpoint.id, {
      listAllEnabled: false
    })
    const updatedEndpoint = await EndpointApi.get(createdEndpoint.id)

    expect(updatedEndpoint.listAllEnabled).toBe(false)

    await EndpointApi.delete(createdEndpoint.id)
    await EntitySchemaApi.delete(schema.id)
  })

  test('should list all', async () => {
    await EndpointApi.listAll()
  })
})