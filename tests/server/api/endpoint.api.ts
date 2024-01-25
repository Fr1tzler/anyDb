import { appConfig } from '../../../src/config'
import { Endpoint } from '../../../src/entity'
import { EndpointRoutes } from '../../../src/routes'
import { Request } from '../../../src/utils/http-request'
import { IListAllResponse } from '../../../src/utils/types'

const address = `http://localhost:${appConfig.port}${EndpointRoutes.basePath}`

export class EndpointApi {
  static async create(payload: Partial<Endpoint>) {
    const { body: createdSchema } = await Request.post<Endpoint>(
      `${address}${EndpointRoutes.routes.createOne()}`, payload
    )
    return createdSchema
  }

  static async get(endpointId: string) {
    const { body: schema } = await Request.get<Endpoint>(
      `${address}${EndpointRoutes.routes.getOne(endpointId)}`
    )
    return schema
  }

  static async listAll() {
    const { body } = await Request.get<IListAllResponse<Endpoint>>(`${address}${EndpointRoutes.routes.listAll()}`)
    return body
  }

  static async put(endpointId: string, payload: Partial<Endpoint>) {
    const { body } = await Request.put<Endpoint>(`${address}${EndpointRoutes.routes.updateOne(endpointId)}`, payload)
    return body
  }

  static async delete(endpointId: string) {
    await Request.delete(`${address}${EndpointRoutes.routes.deleteOne(endpointId)}`)
  }
}