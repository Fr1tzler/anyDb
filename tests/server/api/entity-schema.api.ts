import { appConfig } from '../../../src/config'
import { EntitySchema } from '../../../src/entity'
import { SchemaRoutes } from '../../../src/routes'
import { Request } from '../../../src/utils/http-request'
import { IListAllResponse } from '../../../src/utils/types'

const address = `http://localhost:${appConfig.port}${SchemaRoutes.basePath}`

export class EntitySchemaApi {
  static async create(payload: Partial<EntitySchema>) {
    const { body: createdSchema } = await Request.post<EntitySchema>(
      `${address}${SchemaRoutes.routes.createOne()}`, payload
    )
    return createdSchema
  }

  static async get(schemaId: string) {
    const { body: schema } = await Request.get<EntitySchema>(
      `${address}${SchemaRoutes.routes.getOne(schemaId)}`
    )
    return schema
  }

  static async listAll() {
    const { body } = await Request.get<IListAllResponse<EntitySchema>>(`${address}${SchemaRoutes.routes.listAll()}`)
    return body
  }

  static async put(schemaId: string, payload: Partial<EntitySchema>) {
    const { body } = await Request.put(`${address}${SchemaRoutes.routes.updateOne(schemaId)}`, payload)
    return body
  }

  static async delete(schemaId: string) {
    await Request.delete(`${address}${SchemaRoutes.routes.deleteOne(schemaId)}`)
  }
}