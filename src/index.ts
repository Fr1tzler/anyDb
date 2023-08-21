import { getBaseRepository } from './repository/base.repository'
import { EntitySchemaRepository } from './repository/entity-schema.repository'
import { FieldType } from './types'

const entitySchemaRepository = new EntitySchemaRepository(getBaseRepository())

console.log('@@@entitySchemaRepository', entitySchemaRepository)

const newSchema = entitySchemaRepository.createOne({
  name: 'testSchema',
  boolean: FieldType.BOOLEAN,
  string: FieldType.STRING,
  number: FieldType.NUMBER,
  json: FieldType.JSON
})

console.log('@@@newSchema', newSchema)
console.log('@@@entitySchemaRepository', entitySchemaRepository)
