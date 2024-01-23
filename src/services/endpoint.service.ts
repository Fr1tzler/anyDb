import { Endpoint, Entity } from '../entity'
import { EndpointRepository } from '../repository/endpoint.repository'
import { EntityRepository } from '../repository/entity.repository'
import { IListAllResponse } from '../utils/types'

export class EndpointService {
  constructor (private endpointRepository: EndpointRepository, private entityRepository: EntityRepository) {}

  // #region CRUD methods

  public listAll(offset?: number, limit?: number) {
    return this.endpointRepository.listAll(offset, limit)
  }

  public createOne(partialEndpoint: Partial<Endpoint>) {
    return this.endpointRepository.createOne(partialEndpoint)
  }

  public getOne(id: string) {
    return this.endpointRepository.getOne(id)
  }

  public updateOne(id: string, partialEndpoint: Partial<Endpoint>) {
    return this.endpointRepository.updateOne(id, partialEndpoint)
  }

  public deleteOne(id: string) {
    return this.endpointRepository.deleteOne(id)
  }

  // #endregion

  // #region business logic
  // todo: maybe better naming (priority 2/10)

  public async createEndpointEntity(endpointPath: string, payload: Partial<Entity>): Promise<Entity> {
    const schemaId = await this.validateEndpointAndReturnSchemaId(endpointPath, 'createOneEnabled')
    return await this.entityRepository.createOne({ ...payload, entitySchemaId: schemaId })
  }

  public async listEndpointEntities(
    endpointPath: string, offset: number, limit: number
  ): Promise<IListAllResponse<Entity>> {
    const schemaId = await this.validateEndpointAndReturnSchemaId(endpointPath, 'listAllEnabled')
    return await this.entityRepository.listAllBySchemaId(schemaId, offset, limit)
  }

  public async getEndpointEntity(endpointPath: string, entityId: string): Promise<Entity> {
    const schemaId = await this.validateEndpointAndReturnSchemaId(endpointPath, 'getOneEnabled')
    return await this.checkEntityBelongsToSchema(schemaId, entityId)
  }

  public async updateEndpointEntity(endpointPath: string, entityId: string, payload: Partial<Entity>): Promise<Entity> {
    const schemaId = await this.validateEndpointAndReturnSchemaId(endpointPath, 'updateOneEnabled')
    await this.checkEntityBelongsToSchema(schemaId, entityId)
    return await this.entityRepository.updateOne(entityId, payload)
  }

  public async deleteEndpointEntity(endpointPath: string, entityId: string) {
    const schemaId = await this.validateEndpointAndReturnSchemaId(endpointPath, 'deleteOneEnabled')
    await this.checkEntityBelongsToSchema(schemaId, entityId)
    await this.entityRepository.deleteOne(entityId)
  }

  // #endregion

  // #region helpers

  private async validateEndpointAndReturnSchemaId(
    endpointPath: string, methodToCheck: keyof Endpoint
  ): Promise<string> {
    const endpoint = await this.endpointRepository.getByPath(endpointPath)
    if (!endpoint[methodToCheck]) {
      throw new Error('endpoint does not have this method enabled')
    }
    return endpoint.entitySchemaId
  }

  private async checkEntityBelongsToSchema(schemaId: string, entityId: string): Promise<Entity> {
    const entity = await this.entityRepository.getOne(entityId)
    if (entity.entitySchemaId !== schemaId) {
      throw new Error('entity does not belong to this endpoint')
    }
    return entity
  }

  // #endregion
}
