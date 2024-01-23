import { Server } from '../utils/server'
import { dbQuery } from '../database/connection'
import { EntityRepository } from '../repository/entity.repository'
import { Entity } from '../entity/entity.entity'
import { EnttityService } from '../services/entity.service'
import { EntityRoutes } from '../routes'

const entityRepository = new EntityRepository(dbQuery)
const entityService = new EnttityService(entityRepository)

const server = new Server()

server.get(EntityRoutes.routes.listAll(), () => entityService.listAll())
server.get(EntityRoutes.routes.listAllBySchemaId(), async (req) => {
  const { entitySchemaId } = req.params
  return entityService.listAllBySchemaId(entitySchemaId)
})
server.get(EntityRoutes.routes.getOne(), async (req) => {
  const { entityId } = req.params
  return entityService.getOne(entityId)
}
)
server.post(EntityRoutes.routes.createOne(), async (req) => {
  const rawEntity = await req.getBody<Partial<Entity>>()
  return await entityService.createOne(rawEntity)
})
server.put(EntityRoutes.routes.updateOne(), async (req) => {
  const { entityId } = req.params
  const rawEntity = await req.getBody<Partial<Entity>>()
  return await entityService.updateOne(entityId, rawEntity)
})
server.delete(EntityRoutes.routes.deleteOne(), async (req) => {
  const { entityId } = req.params
  return await entityService.deleteOne(entityId)
})

export const entityController = server