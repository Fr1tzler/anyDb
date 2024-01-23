import { randomUUID } from 'crypto'
import {
  FieldBooleanValueType,
  FieldNumberValueType,
  FieldObjectValueType,
  FieldStringValueType,
  FieldType,
} from '../../src/types'
import { getValueFromFieldValue } from '../../src/utils/field-value'

const commonProps = {
  id: randomUUID(),
  entitySchemaId: randomUUID(),
  schemaFieldId: randomUUID(),
  entityId: randomUUID(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

describe('Field value utils', () => {
  describe('getValueFromFieldValue', () => {
    test('should return null when input is null', () => {
      const result = getValueFromFieldValue(null)
      expect(result).toBeNull()
    })

    test('should return boolean value when input is of type FieldBooleanValueType', () => {
      const input: FieldBooleanValueType = {
        type: FieldType.BOOLEAN,
        booleanValue: true,
        ...commonProps
      }
      const result = getValueFromFieldValue(input)
      expect(result).toBe(true)
    })

    test('should return number value when input is of type FieldNumberValueType', () => {
      const input: FieldNumberValueType = {
        type: FieldType.NUMBER,
        numberValue: 123,
        ...commonProps

      }
      const result = getValueFromFieldValue(input)
      expect(result).toBe(123)
    })

    test('should return string value when input is of type FieldStringValueType', () => {
      const input: FieldStringValueType = {
        type: FieldType.STRING,
        stringValue: 'test',
        ...commonProps

      }
      const result = getValueFromFieldValue(input)
      expect(result).toBe('test')
    })

    test('should return object value when input is of type FieldObjectValueType', () => {
      const input: FieldObjectValueType = {
        type: FieldType.JSON,
        objectValue: { key: 'value' },
        ...commonProps

      }
      const result = getValueFromFieldValue(input)
      expect(result).toEqual({ key: 'value' })
    })
  })
})