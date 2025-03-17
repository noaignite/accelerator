import { describe, expect, it } from 'vitest'
import { chunk } from './chunk'

describe('chunk', () => {
  it('is a function and returns an array', () => {
    expect(typeof chunk).toEqual('function')
    expect(Array.isArray(chunk([], 1))).toEqual(true)
  })

  it('throws an error if passed invalid arguments', () => {
    // @ts-expect-error -- Test invalid interface
    expect(() => chunk('', 2)).toThrowError(/^Argument `array` should be of type array$/)
    // @ts-expect-error -- Test invalid interface
    expect(() => chunk({}, 2)).toThrowError(/^Argument `array` should be of type array$/)
    // @ts-expect-error -- Test invalid interface
    expect(() => chunk([], '')).toThrowError(/^Argument `size` should be of type integer$/)
    expect(() => chunk([], 0)).toThrowError(/^Argument `size` should be greater than 0$/)
    expect(() => chunk([], -1)).toThrowError(/^Argument `size` should be greater than 0$/)
  })

  it('should turn array into thunks of n size', () => {
    const arr = [1, 2, 3, 4, 5, 6] // biome-ignore:
    const len1chunks = [[1], [2], [3], [4], [5], [6]] // biome-ignore:
    const len2chunks = [[1, 2], [3, 4], [5, 6]] // biome-ignore:
    const len3chunks = [[1, 2, 3], [4, 5, 6]] // biome-ignore:
    const len4chunks = [[1, 2, 3, 4], [5, 6]] // biome-ignore:
    const len5chunks = [[1, 2, 3, 4, 5], [6]] // biome-ignore:
    const len6chunks = [[1, 2, 3, 4, 5, 6]] // biome-ignore:
    const len7chunks = [[1, 2, 3, 4, 5, 6]] // biome-ignore:

    expect(chunk(arr, 1)).toStrictEqual(len1chunks)
    expect(chunk(arr, 2)).toStrictEqual(len2chunks)
    expect(chunk(arr, 3)).toStrictEqual(len3chunks)
    expect(chunk(arr, 4)).toStrictEqual(len4chunks)
    expect(chunk(arr, 5)).toStrictEqual(len5chunks)
    expect(chunk(arr, 6)).toStrictEqual(len6chunks)
    expect(chunk(arr, 7)).toStrictEqual(len7chunks)
  })
})
