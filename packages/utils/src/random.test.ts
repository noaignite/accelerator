import { describe, expect, it } from 'vitest'
import { random } from './random'

describe('random', () => {
  it('is a function and returns a number', () => {
    expect(typeof random).toEqual('function')
    expect(typeof random(0, 1)).toEqual('number')
  })

  it('returns an integer between given range', () => {
    for (let i = 0; i < 20; i++) {
      const min = 1
      const max = 10
      const result = random(min, max)
      expect(Number.isInteger(result)).toBe(true)
      expect(result).toBeGreaterThanOrEqual(min)
      expect(result).toBeLessThanOrEqual(max)
    }
    for (let i = 0; i < 20; i++) {
      const min = 1.5
      const max = 10.5
      const result = random(min, max)
      expect(Number.isInteger(result)).toBe(true)
      expect(result).toBeGreaterThanOrEqual(Math.floor(min))
      expect(result).toBeLessThanOrEqual(Math.floor(max))
    }
  })

  it('returns a floating-point number between given range', () => {
    for (let i = 0; i < 20; i++) {
      const min = 1.5
      const max = 10.5
      const result = random(min, max, true)
      expect(result).toBeGreaterThanOrEqual(min)
      expect(result).toBeLessThanOrEqual(max)
    }
  })
})
