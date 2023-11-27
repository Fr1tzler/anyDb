import { Logger } from '../utils/logger'
import { dbQuery } from './connection'
import { migrationList } from './migration-list'
import { readFile, writeFile } from 'fs/promises'

const logger = new Logger('Migrations revert')

const revertMigrations = async () => {
  const dbMigrationsList = await dbQuery<{ tag: string }>(`
    SELECT * FROM "migrations" ORDER BY "id" DESC LIMIT 1
  `)
  const lastMigrationTag = dbMigrationsList[0]?.tag

  if (!lastMigrationTag) {
    return
  }

  const migration = migrationList
    .find(({ tag }) => tag === lastMigrationTag)

  if (!migration) {
    return
  }

  await migration.down(dbQuery)
  await dbQuery('DELETE FROM "migrations" WHERE "tag" = $1', [migration.tag])
  const migrationFileContents = await readFile('./src/database/migration-list.ts')
  const newFileContents = migrationFileContents
    .toString()
    .split('\n')
    .filter(el => !el.includes(migration.tag))
    .join('\n')
  await writeFile('./src/database/migration-list.ts', newFileContents)
  logger.info(`Migration "${migration.tag}" successfully reverted`)
}

revertMigrations()