import { getOfssetAndLimitFromQuery } from '../../src/utils/query'

describe('Query utils', () => {
  test('return defaults if no query is provided', () => {
    expect(getOfssetAndLimitFromQuery({})).toStrictEqual({ offset: 0, limit: 20 })
  })

  test('returns offset and limit from query', () => {
    expect(getOfssetAndLimitFromQuery({ offset: '10', limit: '20' })).toStrictEqual({ offset: 10, limit: 20 })
  })
})