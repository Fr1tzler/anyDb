import { DbQueryExecutor } from '../database/types'
import { Endpoint } from '../entity'
import { IListAllResponse } from '../utils/types'

export interface IEndpointRepository {
  listAll(
    offset?: number,
    limit?: number,
  ): Promise<IListAllResponse<Endpoint>>;
  getOne(endpointId: string): Promise<Endpoint>;
  getByPath(path: string): Promise<Endpoint>;
  createOne(partialEndpoint: Partial<Endpoint>): Promise<Endpoint>;
  updateOne(
    endpointId: string,
    partialEndpoint: Partial<Endpoint>,
  ): Promise<Endpoint>;
  deleteOne(endpointId: string): Promise<void>;
}

export class EndpointRepository implements IEndpointRepository {
  constructor(private dbQuery: DbQueryExecutor) {}

  async listAll(offset: number = 0, limit: number = 20): Promise<IListAllResponse<Endpoint>> {
    const [totalInfo] = await this.dbQuery<{ total: number }>('SELECT COUNT(*) as total FROM "Endpoint"')
    const total = totalInfo.total
    const result = await this.dbQuery<Endpoint>('SELECT * FROM "Endpoint" LIMIT $1 OFFSET $2', [limit, offset])
    return { offset, limit, total, result }
  }

  async getOne(endpointId: string): Promise<Endpoint> {
    const [endpoint] =  await this.dbQuery<Endpoint>('SELECT * FROM "Endpoint" WHERE "id" = $1 LIMIT 1', [endpointId])
    if (!endpoint) {
      throw new Error('endpoint not found')
    }
    return endpoint
  }

  async getByPath(path: string): Promise<Endpoint> {
    const [endpoint] =  await this.dbQuery<Endpoint>('SELECT * FROM "Endpoint" WHERE "path" = $1 LIMIT 1', [path])
    if (!endpoint) {
      throw new Error('endpoint not found')
    }
    return endpoint
  }

  async createOne(partialEndpoint: Partial<Endpoint>): Promise<Endpoint> {
    if (!partialEndpoint.path || !partialEndpoint.entitySchemaId) {
      throw new Error('path and entitySchemaId are required')
    }
    const {
      path,
      entitySchemaId,
      listAllEnabled,
      createOneEnabled,
      getOneEnabled,
      deleteOneEnabled,
      updateOneEnabled
    } = partialEndpoint
    const queryBoolPayload = [
      listAllEnabled, createOneEnabled, getOneEnabled, deleteOneEnabled, updateOneEnabled
    ].map(el => el || false)
    await this.dbQuery(`
      INSERT INTO "EndpointGroup" (
        "path",
        "entitySchemaId",
        "listAllEnabled",
        "createOneEnabled",
        "getOneEnabled",
        "deleteOneEnabled",
        "updateOneEnabled"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [path, entitySchemaId, queryBoolPayload])
    throw new Error('Method not implemented.')
  }

  async updateOne(endpointId: string, partialEndpoint: Partial<Endpoint>): Promise<Endpoint> {
    // todo extract to utils: key => key || key === false (priority 5/10)
    const usedKeys: (keyof Endpoint)[] = (Object.keys(partialEndpoint) as (keyof Endpoint)[])
      .filter(key => key || key === false)
    const querySettersPart = usedKeys.map((key: keyof Endpoint, index) => `"${key}" = $${index + 2}`).join(', ')
    await this.dbQuery(
      `UPDATE "Endpoint" SET ${querySettersPart} WHERE "id" = $1`,
      [endpointId, usedKeys.map(key => partialEndpoint[key] ?? null)],
    )
    return this.getOne(endpointId)
  }

  async deleteOne(endpointId: string): Promise<void> {
    await this.dbQuery('DELETE FROM "Endpoint" WHERE "id" = $1', [endpointId])
  }
}