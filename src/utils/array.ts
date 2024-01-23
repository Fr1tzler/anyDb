/**
 * Returns an array with unique values.
 *
 * @param {T[]} array - the input array
 * @return {T[]} an array with unique values
 */
export function getUniqueArrayValues<T>(array: T[]): T[] {
  return [...new Set(array)]
}

/**
 * Maps an array of objects to an array of values corresponding to the specified key.
 *
 * @param {T[]} array - The input array of objects
 * @param {K} key - The key to map the array elements to
 * @return {T[K][]} An array of values corresponding to the specified key
 */
export function mapArrayToArrayKeys<T, K extends keyof T>(
  array: T[],
  key: K,
): T[K][] {
  return array.map((item) => item[key])
}

/**
 * Filters an array of objects by a specific field value.
 *
 * @param {T[]} array - The array of objects to filter.
 * @param {K} key - The key of the field to filter by.
 * @param {T[K]} value - The value to filter the field by.
 * @return {T[]} The filtered array of objects.
 */
export function filterByFieldValue<T, K extends keyof T>(
  array: T[],
  key: K,
  value: T[K],
): T[] {
  return array.filter((item) => item[key] === value)
}