import { BaseType } from './basetype.type'

type FieldValueBase = BaseType & {
  schemaId: string;
  schemaFieldId: string;
  entityId: string; 
}

export type FieldStringValueType = FieldValueBase & {
  stringValue: string;
}

export type FieldNumberValueType = FieldValueBase & {
  numberValue: number;
}

export type FieldObjectValueType = FieldValueBase & {
  objectValue: Record<string, unknown>;
}

export type FieldBooleanValueType = FieldValueBase & {
  boolenValue: boolean;
}

export type FieldValueType = FieldStringValueType | FieldNumberValueType | FieldObjectValueType | FieldBooleanValueType