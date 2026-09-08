import { isObject } from '@noaignite/utils'
import { describe, expect, it, test } from 'vitest'

describe('isObject', () => {
  it('is a function', () => {
    expect(typeof isObject).toEqual('function')
  })

  test.each([
    [0, false],
    [true, false],
    [false, false],
    [null, false],
    [[], true],
    [new Map(), true],
    [new Set(), true],
    [{}, true],
  ])('isObject(%s) returns %s', (input, expected) => {
    expect(isObject(input)).toEqual(expected)
  })
})
