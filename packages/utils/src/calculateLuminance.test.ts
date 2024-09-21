import { describe, expect, it } from 'vitest'
import { calculateLuminance } from './calculateLuminance'

describe('calculateLuminance', () => {
  it('should work', () => {
    expect(calculateLuminance([255, 255, 255])).toBe(1)
    expect(calculateLuminance([0, 0, 0])).toBe(0)
    expect(calculateLuminance([188, 188, 188])).toBeCloseTo(0.502886458)
  })
})
