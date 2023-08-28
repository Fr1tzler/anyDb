import { writeFile, readFile } from 'fs/promises'
import path from 'path'
import { toUpperCamelCase } from '../utils/string-transformer'

// todo pass timestamp to migration name
const getMigrationSkeleton = (migrationName: string) => `
import { DatabaseMigrationType, DbQueryExecutor } from '../types'

export const ${migrationName}: DatabaseMigrationType = {
  tag: '${migrationName}',
  
  up: async (dbQuery: DbQueryExecutor) => {

  },

  down: async (dbQuery: DbQueryExecutor) => {
    
  }
}
`

async function insertMigrationToMigrationListFile(
  tag: string,
  migrationName: string,
) {
  const migrationsListFileContents = (
    await readFile('./src/database/migration-list.ts')
  ).toString()
  const splitLines = migrationsListFileContents.split('\n')
  const fileImportIndex = splitLines.findIndex((el) =>
    el.includes('// INSERT_POSITION'),
  )
  const importString = `import { ${migrationName} } from './migrations/${tag}'`
  splitLines.splice(fileImportIndex, 0, importString)
  const migrationListString = `  ${migrationName},`
  const migrationListIndex = splitLines.findIndex((el) =>
    el.includes('  // MIGRATION_LIST_POSITION'),
  )
  splitLines.splice(migrationListIndex, 0, migrationListString)
  await writeFile('./src/database/migration-list.ts', splitLines.join('\n'))
}

(async () => {
  const migrationName = process.argv[2]
  if (!migrationName) {
    console.error('Provide migration name')
    return
  }
  const timestamp = new Date().getTime()
  const tag = `${timestamp}-${migrationName}`
  const filePath = path.join('./src/database/migrations', `${tag}.ts`)
  const camelCaseMigrationName = `${toUpperCamelCase(migrationName)}Migration`
  await writeFile(filePath, getMigrationSkeleton(camelCaseMigrationName))
  await insertMigrationToMigrationListFile(tag, camelCaseMigrationName)
})()
