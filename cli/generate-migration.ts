import { writeFile } from 'fs/promises'
import path from 'path'

// todo add migration generate script

const getMigrationSkeleton = (tag: string) => `
import { DatabaseMigrationType, DbQueryExecutor } from '../types'


const migration: DatabaseMigrationType = {
  tag: '${tag}',
  up: async (dbQuery: DbQueryExecutor) => {

  },
  down: async (dbQuery: DbQueryExecutor) => {
    
  }
}

export default migration
`;

(async () => {
  const migrationName = process.argv[2]
  if (!migrationName) {
    console.error('Provide migration name')
    return
  }
  const timestamp = new Date().getTime()
  const tag = `${timestamp}-${migrationName}`
  const filePath = path.join('./src/database/migrations', `${tag}.ts`)  
  await writeFile(filePath, getMigrationSkeleton(tag))
})()