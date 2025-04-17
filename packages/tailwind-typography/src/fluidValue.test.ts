import { describe, expect, it } from 'vitest'
import { fluidValue } from './index'

describe('fluidValue', () => {
  it('generates the basic calc() formula when no clamping', () => {
    const result = fluidValue(16, 24, 640, 768, 'px', false, false)
    expect(result).toBe('calc(16px + 8 * ((100vw - 640px) / 128))')
  })

  it('wraps in clamp() when clampMin and clampMax are true', () => {
    const result = fluidValue(16, 24, 640, 768, 'px', true, true)
    expect(result).toBe('clamp(16px, calc(16px + 8 * ((100vw - 640px) / 128)), 24px)')
  })

  it('uses max() when only clampMin is true', () => {
    const result = fluidValue(12, 20, 320, 1024, 'rem', true, false)
    expect(result).toBe('max(12rem, calc(12rem + 8 * ((100vw - 320rem) / 704)))')
  })

  it('uses min() when only clampMax is true', () => {
    const result = fluidValue(12, 20, 320, 1024, 'rem', false, true)
    expect(result).toBe('min(20rem, calc(12rem + 8 * ((100vw - 320rem) / 704)))')
  })
})
