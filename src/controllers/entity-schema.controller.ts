import { Server } from '../utils/server'
import { EntitySchemaRepository } from '../repository/entity-schema.repository'
import { dbQuery } from '../database/connection'
import { EntitySchema } from '../entity'

const entitySchemaRepository = new EntitySchemaRepository(dbQuery)

const server = new Server()

server.get('/', () => {
  return entitySchemaRepository.listAll()
})
server.get('/:entitySchemaId', async (req) => {
  const { entitySchemaId } = req.params
  return entitySchemaRepository.getOne(entitySchemaId)
})
server.post('/', async (req) => {
  const rawSchema = await req.getBody<Partial<EntitySchema>>()
  return await entitySchemaRepository.createOne(rawSchema)
})
server.put('/:entitySchemaId', async (req) => {
  const { entitySchemaId } = req.params
  const rawSchema = await req.getBody<Partial<EntitySchema>>()
  return await entitySchemaRepository.updateOne(entitySchemaId, rawSchema)
})

export const schemaController = server