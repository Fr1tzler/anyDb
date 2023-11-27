import { Server } from '../utils/server'
import { dbQuery } from '../database/connection'
import { EntityRepository } from '../repository/entity.repository'
import { Entity } from '../entity/entity.entity'
import { EnttityService } from '../services/entity.service'

const entityRepository = new EntityRepository(dbQuery)
const entityService = new EnttityService(entityRepository)

const server = new Server()

server.get('/', () => entityService.listAll())
server.get('/:entityId', async (req) => {
  const { entityId } = req.params
  return entityService.getOne(entityId)
}
)
server.post('/', async (req) => {
  const rawEntity = await req.getBody<Partial<Entity>>()
  return await entityService.createOne(rawEntity)
})
server.put('/:entityId', async (req) => {
  const { entityId } = req.params
  const rawEntity = await req.getBody<Partial<Entity>>()
  return await entityService.updateOne(entityId, rawEntity)
})
server.delete('/:entityId', async (req) => {
  const { entityId } = req.params
  return await entityService.deleteOne(entityId)
})

export const entityController = server