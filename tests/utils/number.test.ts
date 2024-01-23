import { clamp } from '../../src/utils/number'

describe('Number utils', () => {
  test('clamp', () => {
    expect(clamp(1, 2, 3)).toBe(2)
    expect(clamp(4, 2, 3)).toBe(3)
    expect(clamp(2, 0, 3)).toBe(2)
  })
})