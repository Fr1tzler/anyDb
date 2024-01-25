import { Server } from '../utils/server'
import { dbQuery } from '../database/connection'
import { EndpointRoutes } from '../routes'
import { EndpointRepository } from '../repository/endpoint.repository'
import { EndpointService } from '../services/endpoint.service'
import { Endpoint } from '../entity'
import { getOfssetAndLimitFromQuery } from '../utils/query'

const endpointRepository = new EndpointRepository(dbQuery)
const endpointService = new EndpointService(endpointRepository)

const server = new Server()

server.get(EndpointRoutes.routes.listAll(), async (req) => {
  const { offset, limit } = getOfssetAndLimitFromQuery(req.query)
  return endpointService.listAll(offset, limit)
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