
import { DatabaseMigrationType, DbQueryExecutor } from '../types'

export const CreateEndpointEntityMigration1706027953910: DatabaseMigrationType = {
  tag: 'CreateEndpointEntityMigration1706027953910',

  up: async (dbQuery: DbQueryExecutor) => {
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS "EndpointGroup" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp(0),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp(0),
        "path" TEXT UNIQUE NOT NULL,
        "entitySchemaId" UUID NOT NULL REFERENCES "EntitySchema"("id") ON DELETE CASCADE,
        "listAllEnabled" BOOLEAN DEFAULT FALSE,
        "createOneEnabled" BOOLEAN DEFAULT FALSE,
        "getOneEnabled" BOOLEAN DEFAULT FALSE,
        "deleteOneEnabled" BOOLEAN DEFAULT FALSE,
        "updateOneEnabled" BOOLEAN DEFAULT FALSE
      )
    `)
  },

  down: async (dbQuery: DbQueryExecutor) => {
    await dbQuery('DROP TABLE IF EXISTS "EndpointGroup"')
  }
}
