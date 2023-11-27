/* eslint-disable max-len */
import { validatePathMatch, getBaseUrl, getPathParams } from '../../src/utils/server'

describe('Server utils', () => {
  describe('validatePathMatch', () => {
    it('should return true when requestPath and controllerPath match', () => {
      const requestPath = '/users/123'
      const controllerPath = '/users/:id'
      expect(validatePathMatch(requestPath, controllerPath)).toBe(true)
    })

    it('should return false when requestPath and controllerPath do not have the same number of parts', () => {
      const requestPath = '/users/123'
      const controllerPath = '/users/:id/:name'
      expect(validatePathMatch(requestPath, controllerPath)).toBe(false)
    })

    it('should return false when requestPath and controllerPath contain different parts', () => {
      const requestPath = '/users_list/123'
      const controllerPath = '/users/:id'
      expect(validatePathMatch(requestPath, controllerPath)).toBe(false)
    })
  })

  describe('getBaseUrl', () => {
    it('should return "/" if requestUrl is undefined', () => {
      const baseUrl = getBaseUrl(undefined)
      expect(baseUrl).toBe('/')
    })

    it('should return the part of the requestUrl before the "?" if requestUrl is defined', () => {
      const baseUrl = getBaseUrl('https://example.com/api/v1/users?param=value')
      expect(baseUrl).toBe('https://example.com/api/v1/users')
    })

    it('should return the full requestUrl if there is no "?" in the requestUrl', () => {
      const baseUrl = getBaseUrl('https://example.com/api/v1/users')
      expect(baseUrl).toBe('https://example.com/api/v1/users')
    })
  })

  describe('getPathParams', () => {
    it('should work with strings', () => {
      const requestPath = '/users/qwerty'
      const controllerPath = '/users/:id'
      const result = getPathParams(requestPath, controllerPath)
      expect(result).toEqual({ id: 'qwerty' })
    })

    it('should throw an error when the request path does not match the controller path', () => {
      const requestPath = '/users/123'
      const controllerPath = '/books/:id'
      expect(() => getPathParams(requestPath, controllerPath)).toThrowError(
        `url "${requestPath}" can't be mapped to "${controllerPath}"`
      )
    })

    // todo unwanted behaviour
    it('should handle empty path segments', () => {
      const requestPath = '/users//123'
      const controllerPath = '/users/:id'
      const result = getPathParams(requestPath, controllerPath)
      expect(result).toEqual({ id: '123' })
    })
  })
})