import {
  capitalise,
  snakeOrKebabToCamelCase,
  toUpperCamelCase,
} from './string-transformer'

describe('String transformer', () => {
  describe('capitalise', () => {
    test('should capitalise the first letter of a string', () => {
      expect(capitalise('abc')).toBe('Abc')
      expect(capitalise('foo')).toBe('Foo')
      expect(capitalise('bar')).toBe('Bar')
    })

    test('should return an empty string if the input is empty', () => {
      expect(capitalise('')).toBe('')
    })
  })

  describe('snakeOrKebabToCamelCase', () => {
    test('should convert snake_case_string to snakeCaseString', () => {
      expect(snakeOrKebabToCamelCase('snake_case_string')).toBe('snakeCaseString')
    })

    test('should convert kebab-case-string to kebabCaseString', () => {
      expect(snakeOrKebabToCamelCase('kebab-case-string')).toBe('kebabCaseString')
    })

    test('should remove all hyphens and underscores', () => {
      expect(snakeOrKebabToCamelCase('hello-world')).toBe('helloWorld')
      expect(snakeOrKebabToCamelCase('hello_world')).toBe('helloWorld')
    })
  })

  describe('toUpperCamelCase', () => {
    it('should convert snake case to upper camel case', () => {
      const input = 'hello_world'
      const expected = 'HelloWorld'
      expect(toUpperCamelCase(input)).toBe(expected)
    })

    it('should convert kebab case to upper camel case', () => {
      const input = 'hello-world'
      const expected = 'HelloWorld'
      expect(toUpperCamelCase(input)).toBe(expected)
    })

    it('should not change upper camel case', () => {
      const input = 'HelloWorld'
      expect(toUpperCamelCase(input)).toBe(input)
    })

    it('should change lower camel case', () => {
      const input = 'helloWorld'
      const expected = 'HelloWorld'
      expect(toUpperCamelCase(input)).toBe(expected)
    })

    it('should return an empty string for an empty input', () => {
      const input = ''
      expect(toUpperCamelCase(input)).toBe(input)
    })
  })
})
