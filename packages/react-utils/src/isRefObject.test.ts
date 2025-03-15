import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { isRefObject } from './isRefObject'

describe('isRefObject', () => {
  it('returns true for a createRef object', () => {
    const ref = createRef<HTMLDivElement>()
    expect(isRefObject(ref)).toBe(true)
  })

  it('returns false for null or undefined', () => {
    expect(isRefObject(null)).toBe(false)
    expect(isRefObject(undefined)).toBe(false)
  })

  it('returns false for a plain object without a current property', () => {
    expect(isRefObject({})).toBe(false)
  })

  it('returns false for window', () => {
    expect(isRefObject(window)).toBe(false)
  })

  it('returns false for a function', () => {
    const fn = () => {}
    expect(isRefObject(fn)).toBe(false)
  })

  it('returns true for an object shaped like a ref (has a current property)', () => {
    // Because isRefObject only checks if it's an extensible object with a 'current' property,
    // this will return true even though it's not a "real" React ref.
    const fakeRef = { current: null }
    expect(isRefObject(fakeRef)).toBe(true)
  })
})
