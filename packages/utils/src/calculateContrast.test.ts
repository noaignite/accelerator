import { describe, expect, it } from 'vitest'
import { calculateContrast } from './calculateContrast'

describe('calculateContrast', () => {
  it('should work', () => {
    expect(calculateContrast([255, 255, 255], [0, 0, 0])).toBe(21)
    expect(calculateContrast([188, 188, 188], [0, 0, 0])).toBeCloseTo(11.05, 1) // contrast ratio sourced from https://webaim.org/resources/contrastchecker/
  })
})
