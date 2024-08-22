import { describe, expect, it } from 'vitest'
import omit from './omit'

describe('omit', () => {
  it('returns the correct result', () => {
    expect(omit({ foo: 0, baz: 1 }, ['baz'])).toEqual({ foo: 0 })
    expect(omit({ foo: 0, baz: { bar: 1 } }, ['baz'])).toEqual({ foo: 0 })
    expect(omit({ foo: 0, baz: { bar: 1 } }, ['foo'])).toEqual({ baz: { bar: 1 } })
    // @ts-expect-error -- Test invalid keys
    expect(omit({ a: 1, b: 2, c: 3 }, ['a', 'c', 'd'])).toEqual({ b: 2 })
  })
})
