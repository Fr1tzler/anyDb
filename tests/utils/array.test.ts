import { filterByFieldValue, getUniqueArrayValues, mapArrayToArrayKeys } from '../../src/utils/array'

describe('Array utils', () => {
  test('getUniqueArrayValues', () => {
    expect(getUniqueArrayValues([])).toStrictEqual([])
    expect(getUniqueArrayValues([1, 1, 1])).toStrictEqual([1])
    expect(getUniqueArrayValues([1, 2, 3])).toStrictEqual([1, 2, 3])
    expect(getUniqueArrayValues(['1', '1'])).toStrictEqual(['1'])
  })

  test('mapArrayToArrayKeys', () => {
    const inputArray = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]
    const key = 'name'
    const expectedResult = ['Alice', 'Bob']
    expect(mapArrayToArrayKeys(inputArray, key)).toEqual(expectedResult)
  })

  describe('filterByFieldValue', () => {
    const todos = [
      { id: 1, title: 'Buy groceries', completed: false },
      { id: 2, title: 'Go to the gym', completed: true },
      { id: 3, title: 'Read a book', completed: false },
    ]

    test('filters by title', () => {
      const filtered = filterByFieldValue(todos, 'title', 'Buy groceries')
      expect(filtered).toEqual([{ id: 1, title: 'Buy groceries', completed: false }])
    })

    test('filters by completed status', () => {
      const filtered = filterByFieldValue(todos, 'completed', true)
      expect(filtered).toEqual([{ id: 2, title: 'Go to the gym', completed: true }])
    })

    test('filters by non-existent value', () => {
      const filtered = filterByFieldValue(todos, 'title', 'Cook dinner')
      expect(filtered).toEqual([])
    })
  })
})