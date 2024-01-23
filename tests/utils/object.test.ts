import { extractValueFromObject } from '../../src/utils/object'

describe('Object utils', () => {
  test('extractValueFromObject', () => {
    const todoTask = {
      id: 1,
      title: 'Buy groceries',
      completed: false,
    }
    const key = 'title'
    const expectedResult = 'Buy groceries'
    expect(extractValueFromObject(todoTask, key)).toEqual(expectedResult)
  })
})