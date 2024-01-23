/**
 * Capitalizes the first letter of the input string.
 *
 * @param {string} input - the input string to capitalize
 * @return {string} the capitalized string
 */
export function capitalise(input: string) {
  if (input.length === 0) {
    return ''
  }
  return input[0].toUpperCase() + input.slice(1)
}

/**
 * Convert a snake_case or kebab-case string to camelCase.
 *
 * @param {string} input - the input string to be converted
 * @return {string} the camelCase version of the input string
 */
export function snakeOrKebabToCamelCase(input: string) {
  const chars = input.split('')
  for (let i = 1; i < chars.length; i++) {
    if (['-', '_'].includes(input[i - 1])) {
      chars[i] = input[i].toUpperCase()
    }
  }
  return chars.join('').replace(/-|_/gm, '')
}

export const toUpperCamelCase = (input: string) =>
  capitalise(snakeOrKebabToCamelCase(input))
