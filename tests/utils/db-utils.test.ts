import { generateDbParametersList } from '../../src/utils/db-utils'

describe('Db utils', () => {
  it('generateDbParametersList', () => {
    const objectCount = 2
    const fieldsPerObject = 3
    const expected = '($1, $2, $3), ($4, $5, $6)'
    expect(generateDbParametersList(objectCount, fieldsPerObject)).toEqual(expected)
  })
})