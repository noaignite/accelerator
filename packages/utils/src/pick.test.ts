import { describe, expect, it } from 'vitest'
import pick from './pick'

describe('pick', () => {
  it('returns the correct result', () => {
    expect(pick({ foo: 0, baz: 1 }, ['baz'])).toEqual({ baz: 1 })
    expect(pick({ foo: 0, baz: { bar: 1 } }, ['baz'])).toEqual({ baz: { bar: 1 } })
    expect(pick({ foo: 0, baz: { bar: 1 } }, ['foo'])).toEqual({ foo: 0 })
    // @ts-expect-error -- Test invalid keys
    expect(pick({ a: 1, b: 2, c: 3 }, ['a', 'c', 'd'])).toEqual({ a: 1, c: 3 })
  })
})
