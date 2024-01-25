import { randomUUID } from 'crypto'
import { EndpointRepository } from '../../src/repository/endpoint.repository'
import { dbQuery } from '../../src/database/connection'
import { EndpointService } from '../../src/services/endpoint.service'
import { EntitySchemaService } from '../../src/services/entity-schema.service'
import { EntitySchemaRepository } from '../../src/repository/entity-schema.repository'
import { EndpointApiService } from '../../src/services/endpoint-api.service'
import { EntityRepository } from '../../src/repository/entity.repository'

const entitySchemaRepository = new EntitySchemaRepository(dbQuery)
const entitySchemaService = new EntitySchemaService(entitySchemaRepository)
const entityRepository = new EntityRepository(dbQuery)
const endpointRepository = new EndpointRepository(dbQuery)
const endpointService = new EndpointService(endpointRepository)
const endpointApiService = new EndpointApiService(endpointRepository, entityRepository)

describe('EndpointApi service', () => {
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

    const { total: totalBeforeCreate } = await endpointApiService.listEndpointEntities(endpointPath)
    expect(totalBeforeCreate).toBe(0)
    const createdEntity = await endpointApiService.createEndpointEntity(endpointPath, { testField: 'test' })
    expect(createdEntity.testField).toBe('test')
    const entityFromDB = await endpointApiService.getEndpointEntity(endpointPath, createdEntity.id)
    expect(entityFromDB).toStrictEqual(createdEntity)
    const updatedEntity = await endpointApiService.updateEndpointEntity(
      endpointPath, createdEntity.id, { testField: 'test2' }
    )
    expect(updatedEntity.testField).toBe('test2')
    const { total: totalAfterCreate } = await endpointApiService.listEndpointEntities(endpointPath)
    expect(totalAfterCreate).toBe(1)
    await endpointApiService.deleteEndpointEntity(endpointPath, createdEntity.id)
    const { total: totalAfterDelete } = await endpointApiService.listEndpointEntities(endpointPath)
    expect(totalAfterDelete).toBe(0)

    await endpointService.deleteOne(createdEndpoint.id)
    await entitySchemaService.deleteOne(schema.id)
  })
})