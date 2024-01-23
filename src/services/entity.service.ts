import { Entity } from '../entity/entity.entity'
import { EntityRepository } from '../repository/entity.repository'

export class EnttityService {
  constructor (private entiryRepository: EntityRepository) {}

  public listAll(offset?: number, limit?: number) {
    return this.entiryRepository.listAll(offset, limit)
  }

  public listAllBySchemaId(entitySchemaId: string, offset?: number, limit?: number) {
    return this.entiryRepository.listAllBySchemaId(entitySchemaId, offset, limit)
  }

  public createOne(partialEntity: Partial<Entity>) {
    return this.entiryRepository.createOne(partialEntity)
  }

  public getOne(id: string) {
    return this.entiryRepository.getOne(id)
  }

  public updateOne(id: string, partialEntity: Partial<Entity>) {
    return this.entiryRepository.updateOne(id, partialEntity)
  }

  public deleteOne(id: string) {
    return this.entiryRepository.deleteOne(id)
  }
}
