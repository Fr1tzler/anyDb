import { Endpoint } from '../entity'
import { EndpointRepository } from '../repository/endpoint.repository'

export class EndpointService {
  constructor (private endpointRepository: EndpointRepository) {}

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
}
