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
      },
    },
    {
      path: '/:entitySchemaId',
      method: HttpMethod.GET,
      executor: async (req) => {
        const { entitySchemaId } = getPathParams<{ entitySchemaId: string }>(
          req.url ?? '',
          '/schema/:entitySchemaId',
        )
        return entitySchemaRepository.getOne(entitySchemaId)
      },
    },
    {
      path: '/',
      method: HttpMethod.POST,
      executor: async (req: IncomingMessage) => {
        const rawSchema = await extractBody<Partial<EntitySchema>>(req)
        return await entitySchemaRepository.createOne(rawSchema)
      },
    },
    {
      path: '/:entitySchemaId',
      method: HttpMethod.PUT,
      executor: async (req) => {
        const { entitySchemaId } = getPathParams<{ entitySchemaId: string }>(
          req.url ?? '',
          '/schema/:entitySchemaId',
        )
        const rawSchema = await extractBody<Partial<EntitySchema>>(req)
        return entitySchemaRepository.updateOne(entitySchemaId, rawSchema)
      },
    },
    {
      path: '/:entitySchemaId',
      method: HttpMethod.DELETE,
      executor: async (req) => {
        const { entitySchemaId } = getPathParams<{ entitySchemaId: string }>(
          req.url ?? '',
          '/schema/:entitySchemaId',
        )
        return entitySchemaRepository.deleteOne(entitySchemaId)
      },
    },
  ],
}
