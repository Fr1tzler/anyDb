import { EntitySchema } from '../entity/entity-schema.entity'
import { EntitySchemaRepository } from '../repository/entity-schema.repository'

export class EnttitySchemaService {
  constructor (private entirySchemaRepository: EntitySchemaRepository) {}

  public listAll(offset?: number, limit?: number) {
    return this.entirySchemaRepository.listAll(offset, limit)
  }

  public createOne(partialSchema: Partial<EntitySchema>) {
    return this.entirySchemaRepository.createOne(partialSchema)
  }

  public getOne(id: string) {
    return this.entirySchemaRepository.getOne(id)
  }

  public updateOne(id: string, partialSchema: Partial<EntitySchema>) {
    return this.entirySchemaRepository.updateOne(id, partialSchema)
  }

  public deleteOne(id: string) {
    return this.entirySchemaRepository.deleteOne(id)
  }
}
