import { Server } from '../utils/server'
import { dbQuery } from '../database/connection'
import { EndpointRoutes } from '../routes'
import { EndpointRepository } from '../repository/endpoint.repository'
import { EndpointService } from '../services/endpoint.service'
import { Endpoint } from '../entity'
import { EntityRepository } from '../repository/entity.repository'

const endpointRepository = new EndpointRepository(dbQuery)
const entityRepository = new EntityRepository(dbQuery)
const endpointService = new EndpointService(endpointRepository, entityRepository)

const server = new Server()

server.get(EndpointRoutes.routes.listAll(), async () => {
  return endpointService.listAll()
})
server.get(EndpointRoutes.routes.getOne(), async (req) => {
  const { endpointId } = req.params
  return endpointService.getOne(endpointId)
}
)
server.post(EndpointRoutes.routes.createOne(), async (req) => {
  const rawEntity = await req.getBody<Partial<Endpoint>>()
  return await endpointService.createOne(rawEntity)
})
server.put(EndpointRoutes.routes.updateOne(), async (req) => {
  const { endpointId } = req.params
  const rawEntity = await req.getBody<Partial<Endpoint>>()
  return await endpointService.updateOne(endpointId, rawEntity)
})
server.delete(EndpointRoutes.routes.deleteOne(), async (req) => {
  const { endpointId } = req.params
  return await endpointService.deleteOne(endpointId)
})

export const endpointController = server