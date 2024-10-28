import { assert } from './assert'

/**
 * Splits an array into chunks of a specified size.
 *
 * @param array - The array to be split into chunks.
 * @param size - The maximum size of each chunk. Must be a positive integer.
 * @returns An array of chunks, where each chunk is an array of elements from the input array.
 * @throws Will throw an error if `array` is not an array.
 * @throws Will throw an error if `size` is not a positive integer.
 *
 * @example
 * ```ts
 * chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
 * ```
 */
export function chunk<T>(array: T[], size: number): T[][] {
  assert(Array.isArray(array), 'Argument `array` should be of type array')
  assert(Number.isInteger(size), 'Argument `size` should be of type integer')
  assert(size > 0, 'Argument `size` should be greater than 0')

  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }

  return result
}
