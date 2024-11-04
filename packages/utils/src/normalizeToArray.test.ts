import { describe, expect, it } from 'vitest'
import { normalizeToArray } from './normalizeToArray'

describe('normalizeToArray', () => {
  it('is a function and returns an array', () => {
    expect(typeof normalizeToArray).toEqual('function')
    expect(Array.isArray(normalizeToArray(undefined))).toBe(true)
  })

  it('ensures passed argument is an array', () => {
    expect(normalizeToArray(undefined)).toStrictEqual([])
    expect(normalizeToArray(NaN)).toStrictEqual([NaN])
    expect(normalizeToArray(null)).toStrictEqual([null])
    expect(normalizeToArray('')).toStrictEqual([''])
    expect(normalizeToArray(0)).toStrictEqual([0])
    expect(normalizeToArray(1)).toStrictEqual([1])
    expect(normalizeToArray('foo')).toStrictEqual(['foo'])
    expect(normalizeToArray(true)).toStrictEqual([true])
    expect(normalizeToArray({})).toStrictEqual([{}])
    expect(normalizeToArray([])).toStrictEqual([])
  })
})
