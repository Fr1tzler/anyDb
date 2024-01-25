import { clamp } from './number'

/**
 * Returns the offset and limit values parsed from the query object.
 *
 * @param {Record<string, string>} query - The query object containing offset and limit parameters as strings
 * @return {{ offset: number, limit: number }} The offset and limit values as an object
 */
export function getOfssetAndLimitFromQuery(query: Record<string, string>): { offset: number, limit: number } {
  const offset = Number(query.offset) || 0
  const limit = clamp(Number(query.limit) || 20, 0, 100)
  return { offset, limit }
}