import { IncomingMessage } from 'http'
import { ControllerGroup, HttpMethod } from '../types'
import { extractBody, getPathParams } from '../utils/server'
import { EntitySchemaRepository } from '../repository/entity-schema.repository'
import { dbQuery } from '../database/connection'
import { EntitySchema } from '../entity'

const entitySchemaRepository = new EntitySchemaRepository(dbQuery)

const basePath = '/schema'

export const schemaControllerGroup: ControllerGroup = {
  basePath,
  controllers: [
    {
      path: '/',
      method: HttpMethod.GET,
      executor: async () => {
        return entitySchemaRepository.listAll()         
      }
    },
    {
      path: '/:schemaId',
      method: HttpMethod.GET,
      executor: async (req) => {
        const { schemaId } = getPathParams<{ schemaId: string }>(req.url ?? '', '/schema/:schemaId')        
        return entitySchemaRepository.getOne(schemaId)
      }
    },
    {
      path: '/',
      method: HttpMethod.POST,
      executor: async (req: IncomingMessage) => {
        const rawSchema = await extractBody<Partial<EntitySchema>>(req)
        return await entitySchemaRepository.createOne(rawSchema)
      }
    },
    {
      path: '/:schemaId',
      method: HttpMethod.PUT,
      executor: async (req) => {
        const { schemaId } = getPathParams<{ schemaId: string }>(req.url ?? '', '/schema/:schemaId')
        const rawSchema = await extractBody<Partial<EntitySchema>>(req)
        return entitySchemaRepository.updateOne(schemaId, rawSchema)
      }
    },
    {
      path: '/:schemaId',
      method: HttpMethod.DELETE,
      executor: async (req) => {
        const { schemaId } = getPathParams<{ schemaId: string }>(req.url ?? '', '/schema/:schemaId')
        return entitySchemaRepository.deleteOne(schemaId)
      }
    },

  ],
}