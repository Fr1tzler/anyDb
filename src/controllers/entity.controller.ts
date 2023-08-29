import { IncomingMessage } from 'http'
import { ControllerGroup, HttpMethod } from '../types'
import { extractBody, getPathParams } from '../utils/server'
import { dbQuery } from '../database/connection'
import { EntityRepository } from '../repository/entity.repository'
import { Entity } from '../entity/entity.entity'
import { EnttityService } from '../services/entity.service'

const entityRepository = new EntityRepository(dbQuery)
const entityService = new EnttityService(entityRepository)

const basePath = '/entity'

export const entityControllerGroup: ControllerGroup = {
  basePath,
  controllers: [
    {
      path: '/',
      method: HttpMethod.GET,
      executor: async () => {
        return entityService.listAll()
      },
    },
    {
      path: '/:entityId',
      method: HttpMethod.GET,
      executor: async (req) => {
        const { entityId } = getPathParams<{ entityId: string }>(
          req.url ?? '',
          '/entity/:entityId',
        )
        return entityService.getOne(entityId)
      },
    },
    {
      path: '/',
      method: HttpMethod.POST,
      executor: async (req: IncomingMessage) => {
        const rawEntity = await extractBody<Partial<Entity>>(req)
        return await entityService.createOne(rawEntity)
      },
    },
    {
      path: '/:entityId',
      method: HttpMethod.PUT,
      executor: async (req) => {
        const { entityId } = getPathParams<{ entityId: string }>(
          req.url ?? '',
          '/entity/:entityId',
        )
        const rawEntity = await extractBody<Partial<Entity>>(req)
        return entityService.updateOne(entityId, rawEntity)
      },
    },
    {
      path: '/:entityId',
      method: HttpMethod.DELETE,
      executor: async (req) => {
        const { entityId } = getPathParams<{ entityId: string }>(
          req.url ?? '',
          '/entity/:entityId',
        )
        return entityService.deleteOne(entityId)
      },
    },
  ],
}
