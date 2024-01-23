import { Pool, QueryResultRow } from 'pg'
import { dbConfig } from '../config'
import { DbQueryParameterType } from './types'

const pool = new Pool(dbConfig)

/**
 * Executes a database query and returns the result as an array of the specified type.
 *
 * @param {string} query - The SQL query to be executed.
 * @param {DbQueryParameterType} [params] - Optional parameters for the SQL query.
 * @return {Promise<T[]>} The result of the database query as an array of the specified type.
 */
export async function dbQuery<T extends QueryResultRow>(
  query: string,
  params?: DbQueryParameterType,
): Promise<T[]> {
  const client = await pool.connect()
  const result = await client.query<T>(query, params)
  client.release()
  return result.rows
}
