import { BaseType } from './basetype.type'

export type EntityType = BaseType & {
  entitySchemaId: string;
};
