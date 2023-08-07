import { EntitySchemaType, FieldType } from '../types'

export type EntitySchema = EntitySchemaType & {
  [key: string]: FieldType,
} 