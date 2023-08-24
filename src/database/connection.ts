import { Pool, QueryResultRow } from 'pg'
import { dbConfig } from '../config'
import { DbQueryParameterType } from './types'
 
const pool = new Pool(dbConfig)

export async function dbQuery<T extends QueryResultRow>(query: string, params?: DbQueryParameterType): Promise<T[]> {
  const client = await pool.connect()
  const result = await client.query<T>(query, params)
  client.release()
  return result.rows
}