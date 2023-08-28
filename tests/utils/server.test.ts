import { getBaseUrl } from '../../src/utils/server'

describe('Server utils', () => {
  test('URL parser', () => {
    expect(getBaseUrl(undefined)).toBe('/')
    expect(getBaseUrl('/foo/bar')).toBe('/foo/bar')
    expect(getBaseUrl('/foo/bar?baz=quux')).toBe('/foo/bar')
  })

  // todo test getPathParams
})
