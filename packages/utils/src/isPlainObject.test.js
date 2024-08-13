import { describe, expect, it, test } from 'vitest'
import isPlainObject from './isPlainObject'

describe('isPlainObject', () => {
  it('is a function', () => {
    expect(typeof isPlainObject).toEqual('function')
  })

  test.each([
    [0, false],
    [true, false],
    [false, false],
    [null, false],
    [[], false],
    [new Map(), false],
    [new Set(), false],
    [{}, true],
  ])('isPlainObject(%s) returns %s', (input, expected) => {
    expect(isPlainObject(input)).toEqual(expected)
  })
})
