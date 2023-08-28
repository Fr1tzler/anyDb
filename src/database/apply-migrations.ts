import { migrationList } from './migration-list'
import { DbQueryExecutor, MigrationEntity } from './types'

async function createMigrationsTable(dbQuery: DbQueryExecutor): Promise<void> {
  await dbQuery<object>(`
    CREATE SEQUENCE migrations_id_seq;
  `)
  await dbQuery<object>(`
    CREATE TABLE migrations (
      id INTEGER NOT NULL PRIMARY KEY DEFAULT nextval('migrations_id_seq'),
      tag VARCHAR(50) NOT NULL
    );
  `)
  await dbQuery<object>(`
    ALTER SEQUENCE migrations_id_seq owned by migrations.id;
  `)
}

async function checkActiveMigrations(
  dbQuery: DbQueryExecutor,
): Promise<string[]> {
  const migrationsExistResult = await dbQuery<{ count: number }>(`
    SELECT
      1 as count
    FROM 
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
  const existResult = await dbQuery<MigrationEntity>(
    'SELECT * FROM migrations ORDER BY ID ASC',
  )

  return existResult.map(({ tag }) => tag)
}

async function registerMigration(tag: string, dbQuery: DbQueryExecutor) {
  await dbQuery<object>('INSERT INTO migrations (tag) VALUES ($1)', [tag])
}

export async function applyMigrations(dbQuery: DbQueryExecutor) {
  const appliedMigrationTags = await checkActiveMigrations(dbQuery)

  for (const migration of migrationList) {
    if (appliedMigrationTags.includes(migration.tag)) {
      continue
    }
    await migration.up(dbQuery)
    console.info(`${migration.tag} sucessfully applied`)
    await registerMigration(migration.tag, dbQuery)
  }
  console.info('Migrations applied succesfully')
}
