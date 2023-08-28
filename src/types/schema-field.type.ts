import { BaseType } from './basetype.type'

export enum FieldType {
  STRING = 'string',
  NUMBER = 'number',
  JSON = 'JSON',
  BOOLEAN = 'boolean',
}

export type SchemaFieldType = BaseType & {
  fieldName: string;
  type: FieldType;
  entitySchemaId: string;
};
