export function capitalise(input: string) {
  if (input.length === 0) {
    return ''
  }
  return input[0].toUpperCase() + input.slice(1)
}

export function snakeOrKebabToCamelCase(input: string) {
  const chars = input.split('')
  for (let i = 1; i < chars.length; i++) {
    if (['-', '_'].includes(input[i - 1])) {
      chars[i] = input[i].toUpperCase()
    }
  }
  return chars.join('').replace(/-|_/gm, '')
} 

export const toUpperCamelCase = (input: string) => capitalise(snakeOrKebabToCamelCase(input)) 