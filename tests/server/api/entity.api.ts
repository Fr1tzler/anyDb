import { appConfig } from '../../../src/config'
import { Entity } from '../../../src/entity'
import { EntityRoutes } from '../../../src/routes'
import { Request } from '../../../src/utils/http-request'
import { IListAllResponse } from '../../../src/utils/types'

const address = `http://localhost:${appConfig.port}${EntityRoutes.basePath}`

export class EntityApi {
  static async create(payload: Partial<Entity>) {
    const { body: createdEntity } = await Request.post<Entity>(
      `${address}${EntityRoutes.routes.createOne()}`, payload
    )
    return createdEntity
  }

  static async get(entityId: string) {
    const { body: entity } = await Request.get<Entity>(
      `${address}${EntityRoutes.routes.getOne(entityId)}`
    )
    return entity
  }

  static async listAllBySchemaId(schemaId: string) {
    const { body } = await Request.get<IListAllResponse<Entity>>(
      `${address}${EntityRoutes.routes.listAllBySchemaId(schemaId)}`
    )
    return body
  }

  static async put(entityId: string, payload: Partial<Entity>) {
    const { body } = await Request.put(`${address}${EntityRoutes.routes.updateOne(entityId)}`, payload)
    return body
  }

  static async delete(entityId: string) {
    await Request.delete(`${address}${EntityRoutes.routes.deleteOne(entityId)}`)
  }
}