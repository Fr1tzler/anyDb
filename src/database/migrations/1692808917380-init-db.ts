
import { DatabaseMigrationType, DbQueryExecutor } from '../types'

export const InitDbMigration: DatabaseMigrationType = {
  tag: 'InitDbMigration',
  
  up: async (dbQuery: DbQueryExecutor) => {
    await dbQuery('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    await dbQuery(`
      CREATE TYPE "FieldType" AS ENUM ('string', 'number', 'JSON', 'boolean');
    `)

    await dbQuery(`
      CREATE TABLE IF NOT EXISTS "EntitySchema" (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp(0),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp(0),
        name TEXT NOT NULL
      )
    `)

    await dbQuery(`
      CREATE TABLE IF NOT EXISTS "SchemaField" (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp(0),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp(0),
        "fieldName" TEXT NOT NULL,
        "type" "FieldType" NOT NULL DEFAULT 'string',
        "entitySchemaId" UUID NOT NULL REFERENCES "EntitySchema"("id")
      )
    `)

    await dbQuery(`
      CREATE TABLE IF NOT EXISTS "Entity" (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp(0),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp(0),
        "entitySchemaId" UUID NOT NULL REFERENCES "EntitySchema"("id")
      )
    `)

    await dbQuery(`
      CREATE TABLE IF NOT EXISTS "FieldValue" (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp(0),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp(0),
        "entitySchemaId" UUID NOT NULL REFERENCES "EntitySchema"("id"),
        "schemaFieldId" UUID NOT NULL REFERENCES "SchemaField"("id"),
        "entityId" UUID NOT NULL REFERENCES "Entity"("id"),
        "type" "FieldType" NOT NULL,
        "booleanValue" BOOLEAN,
        "stringValue" TEXT,
        "numberValue" DOUBLE PRECISION,
        "objectValue" JSONB
      )
    `)
  },

  down: async (dbQuery: DbQueryExecutor) => {
    await dbQuery('DROP TABLE IF EXISTS "FieldValue"')

    await dbQuery('DROP TABLE IF EXISTS "Entity"')

    await dbQuery('DROP TABLE IF EXISTS "SchemaField"')

    await dbQuery('DROP TABLE IF EXISTS "EntitySchema"')
    
    await dbQuery('DROP TYPE IF EXISTS "FieldType"')

    await dbQuery('DROP EXTENSION IF EXISTS "uuid-ossp"')    
  }
}
