import {
  EntityFieldValueType,
  FieldType,
  FieldValueType,
  SchemaFieldType,
  fieldIsBoolean,
  fieldIsNumber,
  fieldIsObject,
  fieldIsString
} from '../types'
import { IOtherFields, RecordType } from '../types/field-value.type'

/**
 * Retrieves the value from the given field value, based on its type.
 *
 * @param {FieldValueType | null} input - the input field value
 * @return {EntityFieldValueType} the value extracted from the input field value
 */
export function getValueFromFieldValue(
  input: FieldValueType | null,
): EntityFieldValueType {
  if (!input) {
    return null
  }
  if (fieldIsBoolean(input)) {
    return input.booleanValue
  }
  if (fieldIsNumber(input)) {
    return input.numberValue
  }
  if (fieldIsString(input)) {
    return input.stringValue
  }
  if (fieldIsObject(input)) {
    return input.objectValue
  }
  return null
}


/**
 * Returns a partial FieldValueType or null based on the field type and value, along with otherFields.
 *
 * @param {SchemaFieldType} field - the schema field type
 * @param {EntityFieldValueType} value - the entity field value type
 * @param {IOtherFields} otherFields - other fields
 * @return {Partial<FieldValueType> | null} a partial FieldValueType or null
 */
export function getFieldValueFromObjectField(
  field: SchemaFieldType,
  value: EntityFieldValueType,
  otherFields: IOtherFields,
): Partial<FieldValueType> | null {
  if (field.type === FieldType.BOOLEAN) {
    return {
      booleanValue: Boolean(value),
      ...otherFields,
      type: field.type,
    }
  }
  if (field.type === FieldType.NUMBER) {
    return {
      numberValue: Number(value),
      ...otherFields,
      type: field.type,
    }
  }
  if (field.type === FieldType.STRING) {
    return {
      stringValue: String(value),
      ...otherFields,
      type: field.type,
    }
  }
  if (field.type === FieldType.JSON) {
    return {
      objectValue: value as RecordType,
      ...otherFields,
      type: field.type,
    }
  }
  return null
}