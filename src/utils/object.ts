/**
 * Extracts a value from an object based on the given key.
 *
 * @param {T} obj - the object to extract the value from
 * @param {K} key - the key to extract the value for
 * @return {T[K]} the value associated with the given key
 */
export function extractValueFromObject<T, K extends keyof T>(
  obj: T,
  key: K,
): T[K] {
  return obj[key]
}