import { migrationList } from './migration-list'
import { DbQueryExecutor, MigrationEntity } from './types'

async function createMigrationsTable(dbQuery: DbQueryExecutor): Promise<void> {
  await dbQuery(`
    CREATE SEQUENCE migrations_id_seq;
  `)
  await dbQuery(`
    CREATE TABLE migrations (
      id INTEGER NOT NULL PRIMARY KEY DEFAULT nextval('migrations_id_seq'),
      tag VARCHAR(50) NOT NULL
    );
  `)
  await dbQuery(`
    ALTER SEQUENCE migrations_id_seq owned by migrations.id;
  `)
}

async function checkActiveMigrations(dbQuery: DbQueryExecutor): Promise<string[]> {
  const migrationsExistResult = await dbQuery(`
    SELECT FROM 
      pg_tables
    WHERE 
      schemaname = 'public' AND 
      tablename  = 'migrations'
  `)
  if (!migrationsExistResult.length) {
    console.info('Initialising migrations table')
    await createMigrationsTable(dbQuery)
    console.info('Migrations table created')
    return []
  }
  const existResult = await dbQuery(
    'SELECT * FROM migrations ORDER BY ID ASC'
  ) as MigrationEntity[]
  console.log(existResult)
  
  return existResult.map(({ key }) => key)
}

async function registerMigration(tag: string, dbQuery: DbQueryExecutor) {
  const res = await dbQuery(
    'INSERT INTO migrations (tag) VALUES ($1)',
    [tag]
  )
  console.log(res)
  
}

export async function applyMigrations(dbQuery: DbQueryExecutor) {
  const appliedMigrationTags = await checkActiveMigrations(dbQuery)
  console.log('@@@migrationList', migrationList)
  
  for (const migration of migrationList) {
    if (appliedMigrationTags.includes(migration.tag)) {
      continue
    }
    await migration.up(dbQuery)
    await registerMigration(migration.tag, dbQuery)
  }
  console.info('Migrations applied succesfully')
}