import { BaseType } from './basetype.type'
import { FieldType } from './schema-field.type'

type FieldValueBase = BaseType & {
  schemaId: string;
  schemaFieldId: string;
  entityId: string; 
}

export type FieldBooleanValueType = FieldValueBase & {
  type: FieldType.BOOLEAN;
  booleanValue: boolean;
}

export type FieldStringValueType = FieldValueBase & {
  type: FieldType.STRING;
  stringValue: string;
}

export type FieldNumberValueType = FieldValueBase & {
  type: FieldType.NUMBER;
  numberValue: number;
}

export type RecordType = Record<string, unknown>; 

export type FieldObjectValueType = FieldValueBase & {
  type: FieldType.JSON;
  objectValue: RecordType;
}

export type EntityFieldValueType = string | number | RecordType | boolean | null;

export type FieldValueType = FieldStringValueType | FieldNumberValueType | FieldObjectValueType | FieldBooleanValueType

export function fieldIsBoolean(input: FieldValueType): input is FieldBooleanValueType {
  return input.type === FieldType.BOOLEAN
}

export function fieldIsNumber(input: FieldValueType): input is FieldNumberValueType {
  return input.type === FieldType.NUMBER
}

export function fieldIsString(input: FieldValueType): input is FieldStringValueType {
  return input.type === FieldType.STRING
}

export function fieldIsObject(input: FieldValueType): input is FieldObjectValueType {
  return input.type === FieldType.JSON
}