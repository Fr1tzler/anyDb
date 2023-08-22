import { Pool, QueryResultRow } from 'pg'
import { dbConfig } from '../config'
 
const pool = new Pool(dbConfig)

export async function dbQuery<T extends QueryResultRow>(query: string, params?: string[]) {
  const client = await pool.connect()
  const result = await client.query<T>(query, params)
  client.release()
  return result.rows
}