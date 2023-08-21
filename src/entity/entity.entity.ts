import { EntityType } from '../types'
import { EntityFieldValueType } from '../types/field-value.type'

export type Entity = EntityType & {
  [key: string]: EntityFieldValueType
};