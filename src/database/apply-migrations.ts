import { Logger } from '../utils/logger'
import { migrationList } from './migration-list'
import { DbQueryExecutor, MigrationEntity } from './types'

const logger = new Logger('Migrations')

/**
 * Asynchronously creates a migrations table in the database using the provided DbQueryExecutor.
 *
 * @param {DbQueryExecutor} dbQuery - the database query executor
 * @return {Promise<void>} a promise that resolves when the table is created
 */
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

/**
 * Checks if there are active migrations in the database.
 *
 * @param {DbQueryExecutor} dbQuery - the database query executor
 * @return {Promise<string[]>} the list of active migrations
 */
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
    logger.info('Initialising migrations table')
    await createMigrationsTable(dbQuery)
    logger.info('Migrations table created')
    return []
  }
  const existResult = await dbQuery<MigrationEntity>(
    'SELECT * FROM migrations ORDER BY ID ASC',
  )

  return existResult.map(({ tag }) => tag)
}

/**
 * Asynchronously registers a migration with the provided tag using the given
 * database query executor.
 *
 * @param {string} tag - The tag of the migration to be registered
 * @param {DbQueryExecutor} dbQuery - The database query executor
 * @return {Promise<void>} A promise that resolves when the migration is
 * successfully registered
 */
async function registerMigration(tag: string, dbQuery: DbQueryExecutor) {
  await dbQuery<object>('INSERT INTO migrations (tag) VALUES ($1)', [tag])
}

/**
 * Applies pending migrations to the database.
 *
 * @param {DbQueryExecutor} dbQuery - the database query executor
 * @return {Promise<void>} a promise that resolves once all migrations are applied
 */
export async function applyMigrations(dbQuery: DbQueryExecutor) {
  const appliedMigrationTags = await checkActiveMigrations(dbQuery)

  for (const migration of migrationList) {
    if (appliedMigrationTags.includes(migration.tag)) {
      continue
    }
    await migration.up(dbQuery)
    logger.info(`${migration.tag} sucessfully applied`)
    await registerMigration(migration.tag, dbQuery)
  }
  logger.info('Migrations applied succesfully')
}
