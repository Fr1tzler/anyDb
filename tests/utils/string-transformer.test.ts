import { capitalise, snakeOrKebabToCamelCase } from '../../src/utils/string-transformer'

describe('String transformer', () => {
  test('Capitalise string', () => {
    expect(capitalise('Abc')).toBe('Abc')
    expect(capitalise('abc')).toBe('Abc')
    expect(capitalise(' bc')).toBe(' bc')
    expect(capitalise('1bc')).toBe('1bc')
    expect(capitalise('')).toBe('')
  })

  test('Snake or kebab to camel case string', () => {
    expect(snakeOrKebabToCamelCase('snake_case_string')).toBe('snakeCaseString')
    expect(snakeOrKebabToCamelCase('kebab-case-string')).toBe('kebabCaseString')
  })
})