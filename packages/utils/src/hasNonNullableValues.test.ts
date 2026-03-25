import { describe, expect, expectTypeOf, it } from 'vitest'
import { hasNonNullableValues } from './hasNonNullableValues'

describe('hasNonNullableValues', () => {
  it('works with interface types', () => {
    interface LiteralRecord {
      foo?: 'bar'
    }

    const example = {
      foo: 'bar',
    } as LiteralRecord

    expect(hasNonNullableValues(example, ['foo'])).toBe(true)

    if (hasNonNullableValues(example, ['foo'])) {
      expectTypeOf(example.foo).toEqualTypeOf<'bar'>()
    }
  })

  it('returns true when all requested keys are defined and non-null', () => {
    expect(hasNonNullableValues({ key1: 'value', key2: 2 }, ['key1', 'key2'])).toBe(true)
  })

  it('treats falsy values as valid non-nullable values', () => {
    expect(hasNonNullableValues({ a: 0, b: '', c: false }, ['a', 'b', 'c'])).toBe(true)
  })

  it('returns false when any requested key is null or undefined', () => {
    expect(hasNonNullableValues({ key1: null, key2: 'value' }, ['key1', 'key2'])).toBe(false)
    expect(hasNonNullableValues({ key1: undefined, key2: 'value' }, ['key1', 'key2'])).toBe(false)
  })

  it('returns false when a requested key is missing', () => {
    const value: { key1?: string; key2: string } = { key2: 'value' }

    expect(hasNonNullableValues(value, ['key1', 'key2'])).toBe(false)
  })

  it('narrows the type when used as a type guard', () => {
    const entry: { key1: string | null; key2: number | undefined } = {
      key1: 'value',
      key2: 2,
    }

    if (hasNonNullableValues(entry, ['key1', 'key2'])) {
      expectTypeOf(entry.key1).toEqualTypeOf<string>()
      expectTypeOf(entry.key2).toEqualTypeOf<number>()
    }
  })

  it('narrows the type when used as an array filter predicate', () => {
    const entries: Array<{ key1: string | null; key2: number | undefined }> = [
      { key1: null, key2: 1 },
      { key1: 'value', key2: undefined },
      { key1: 'valid', key2: 2 },
    ]

    const filteredAndTypeNarrowed = entries.filter((entry) =>
      hasNonNullableValues(entry, ['key1', 'key2']),
    ) satisfies Array<{ key1: string; key2: number }>

    expect(filteredAndTypeNarrowed).toEqual([{ key1: 'valid', key2: 2 }])
  })
})
