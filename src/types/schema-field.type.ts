import { BaseType } from './basetype.type'

export enum FieldType {
  STRING = 'string',
  NUMBER = 'number',
  JSON = 'JSON',
  BOOLEN = 'boolean',
}

export type SchemaFieldType = BaseType & {
  fieldName: string;
  type: FieldType,
  entitySchemaId: string;
}