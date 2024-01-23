/**
 * Generates a list of database parameters based on the given object count and fields per object.
 *
 * @param {number} objectCount - the number of objects
 * @param {number} fieldsPerObject - the number of fields per object
 * @return {string} the list of database parameters
 */
export function generateDbParametersList(objectCount: number, fieldsPerObject: number) {
  const result: string[] = []
  for (let i = 0; i < objectCount; i++) {
    const stringItems: string[] = []
    for (let j = 0; j < fieldsPerObject; j++) {
      stringItems.push(`$${fieldsPerObject * i + j + 1}`)
    }
    result.push(`(${stringItems.join(', ')})`)
  }
  return result.join(', ')
}