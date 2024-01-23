import { Server } from '../utils/server'
import { EntitySchemaRepository } from '../repository/entity-schema.repository'
import { dbQuery } from '../database/connection'
import { EntitySchema } from '../entity'
import { SchemaRoutes } from '../routes'

const entitySchemaRepository = new EntitySchemaRepository(dbQuery)

const server = new Server()

server.get(SchemaRoutes.routes.listAll(), () => {
  return entitySchemaRepository.listAll()
})
server.get(SchemaRoutes.routes.getOne(), async (req) => {
  const { entitySchemaId } = req.params
  return entitySchemaRepository.getOne(entitySchemaId)
})
server.post(SchemaRoutes.routes.createOne(), async (req) => {
  const rawSchema = await req.getBody<Partial<EntitySchema>>()
  return await entitySchemaRepository.createOne(rawSchema)
})
server.put(SchemaRoutes.routes.updateOne(), async (req) => {
  const { entitySchemaId } = req.params
  const rawSchema = await req.getBody<Partial<EntitySchema>>()
  return await entitySchemaRepository.updateOne(entitySchemaId, rawSchema)
})
server.delete(SchemaRoutes.routes.deleteOne(), async (req) => {
  const { entitySchemaId } = req.params
  return await entitySchemaRepository.deleteOne(entitySchemaId)
})

export const schemaController = server