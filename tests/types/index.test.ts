import {
  FieldType,
  FieldValueType,
  fieldIsBoolean,
  fieldIsNumber,
  fieldIsObject,
  fieldIsString,
} from '../../src/types'

const now = new Date().toISOString()

const nilUuid = '00000000-0000-0000-0000-000000000000'

const baseValueType = {
  id: nilUuid,
  createdAt: now,
  updatedAt: now,
  schemaId: nilUuid,
  schemaFieldId: nilUuid,
  entityId: nilUuid,
}

const booleanValueType: FieldValueType = {
  ...baseValueType,
  type: FieldType.BOOLEAN,
  booleanValue: false,
}

const stringValueType: FieldValueType = {
  ...baseValueType,
  type: FieldType.STRING,
  stringValue: 'testString',
}

const numberValueType: FieldValueType = {
  ...baseValueType,
  type: FieldType.NUMBER,
  numberValue: 10,
}

const objectValueType: FieldValueType = {
  ...baseValueType,
  type: FieldType.JSON,
  objectValue: {
    test: 'test',
  },
}

describe('Type guards', () => {
  test('Boolean value type', () => {
    expect(fieldIsBoolean(booleanValueType)).toBe(true)
    expect(fieldIsBoolean(stringValueType)).toBe(false)
    expect(fieldIsBoolean(numberValueType)).toBe(false)
    expect(fieldIsBoolean(objectValueType)).toBe(false)
  })

  test('String value type', () => {
    expect(fieldIsString(booleanValueType)).toBe(false)
    expect(fieldIsString(stringValueType)).toBe(true)
    expect(fieldIsString(numberValueType)).toBe(false)
    expect(fieldIsString(objectValueType)).toBe(false)
  })

  test('Number value type', () => {
    expect(fieldIsNumber(booleanValueType)).toBe(false)
    expect(fieldIsNumber(stringValueType)).toBe(false)
    expect(fieldIsNumber(numberValueType)).toBe(true)
    expect(fieldIsNumber(objectValueType)).toBe(false)
  })

  test('Object value type', () => {
    expect(fieldIsObject(booleanValueType)).toBe(false)
    expect(fieldIsObject(stringValueType)).toBe(false)
    expect(fieldIsObject(numberValueType)).toBe(false)
    expect(fieldIsObject(objectValueType)).toBe(true)
  })
})
