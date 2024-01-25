import { Server } from '../utils/server'
import { dbQuery } from '../database/connection'
import { EndpointApiRoutes } from '../routes'
import { EndpointRepository } from '../repository/endpoint.repository'
import { Entity } from '../entity'
import { EntityRepository } from '../repository/entity.repository'
import { EndpointApiService } from '../services/endpoint-api.service'

const endpointRepository = new EndpointRepository(dbQuery)
const entityRepository = new EntityRepository(dbQuery)
const endpointApiService = new EndpointApiService(endpointRepository, entityRepository)

const server = new Server()

server.get(EndpointApiRoutes.routes.listAll(), async (req) => {
  const { endpointPath } = req.params
  return await endpointApiService.listEndpointEntities(endpointPath, 0, 20)
})

server.get(EndpointApiRoutes.routes.getOne(), async (req) => {
  const { endpointPath, entityId } = req.params
  return await endpointApiService.getEndpointEntity(endpointPath, entityId)
})

server.post(EndpointApiRoutes.routes.createOne(), async (req) => {
  const { endpointPath } = req.params
  const rawEntity = await req.getBody<Partial<Entity>>()
  return await endpointApiService.createEndpointEntity(endpointPath, rawEntity)
})

server.put(EndpointApiRoutes.routes.updateOne(), async (req) => {
  const { endpointPath, entityId } = req.params
  const rawEntity = await req.getBody<Partial<Entity>>()
  return await endpointApiService.updateEndpointEntity(endpointPath, entityId, rawEntity)
})

server.delete(EndpointApiRoutes.routes.deleteOne(), async (req) => {
  const { endpointPath, entityId } = req.params
  return await endpointApiService.deleteEndpointEntity(endpointPath, entityId)
})

export const endpointController = server