import { BaseType } from './basetype.type'
import { FieldType } from './schema-field.type'

type FieldValueBase = BaseType & {
  entitySchemaId: string;
  schemaFieldId: string;
  entityId: string;
};

export type FieldBooleanValueType = FieldValueBase & {
  type: FieldType.BOOLEAN;
  booleanValue: boolean;
};

export type FieldStringValueType = FieldValueBase & {
  type: FieldType.STRING;
  stringValue: string;
};

export type FieldNumberValueType = FieldValueBase & {
  type: FieldType.NUMBER;
  numberValue: number;
};

export type RecordType = Record<string, unknown>;

export type FieldObjectValueType = FieldValueBase & {
  type: FieldType.JSON;
  objectValue: RecordType;
};

export type EntityFieldValueType =
  | string
  | number
  | RecordType
  | boolean
  | null;

export type FieldValueType =
  | FieldStringValueType
  | FieldNumberValueType
  | FieldObjectValueType
  | FieldBooleanValueType;

export interface IOtherFields {
  entitySchemaId: string;
  schemaFieldId: string;
  entityId: string;
}

/**
 * Checks if the input field is a boolean type.
 *
 * @param {FieldValueType} input - the input field value to be checked
 * @return {boolean} true if the input field is of type FieldBooleanValueType, false otherwise
 */
export function fieldIsBoolean(
  input: FieldValueType,
): input is FieldBooleanValueType {
  return input.type === FieldType.BOOLEAN
}

/**
 * Checks if the input field is a number type.
 *
 * @param {FieldValueType} input - the input field value to be checked
 * @return {boolean} true if the input field is a number type, false otherwise
 */
export function fieldIsNumber(
  input: FieldValueType,
): input is FieldNumberValueType {
  return input.type === FieldType.NUMBER
}

/**
 * Checks if the input field value is a string type.
 *
 * @param {FieldValueType} input - the input field value to be checked
 * @return {boolean} true if the input is a string field value, false otherwise
 */
export function fieldIsString(
  input: FieldValueType,
): input is FieldStringValueType {
  return input.type === FieldType.STRING
}

/**
 * Checks if the input field is an object type.
 *
 * @param {FieldValueType} input - the input field value to be checked
 * @return {boolean} true if the input is a FieldObjectValueType, false otherwise
 */
export function fieldIsObject(
  input: FieldValueType,
): input is FieldObjectValueType {
  return input.type === FieldType.JSON
}
