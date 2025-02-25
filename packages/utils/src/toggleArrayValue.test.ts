import { describe, expect, it } from 'vitest'
import { toggleArrayValue } from './toggleArrayValue'

describe('toggleArrayValue', () => {
  it('is a function and returns an array', () => {
    expect(typeof toggleArrayValue).toEqual('function')
    expect(Array.isArray(toggleArrayValue([], ''))).toBe(true)
  })

  it('toggles given value from the passed array', () => {
    const original = [1, 'foo', true]
    let modified = [...original]

    original.forEach((value) => {
      modified = toggleArrayValue(modified, value)
      expect(modified.includes(value)).toBe(false)
      modified = toggleArrayValue(modified, value)
      expect(modified.includes(value)).toBe(true)
    })

    modified = toggleArrayValue(modified, 'bar')
    expect(modified.includes('bar')).toBe(true)
    modified = toggleArrayValue(modified, 'bar')
    expect(modified.includes('bar')).toBe(false)
  })
})
