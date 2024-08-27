/**
 * Generate an array of numbers from start to stop with a step
 *
 * @param start - The start of the range
 * @param stop - The end of the range
 * @param step - The step between each number
 * @param inclusive - Include the stop number in the range
 * @returns An array of numbers
 *
 * @example
 * ```ts
 * range(0, 5, 1) // [0, 1, 2, 3, 4, 5]
 * range(0, 5, 1, false) // [0, 1, 2, 3, 4]
 * range(0, 5, 2) // [0, 2, 4]
 * ```
 */
export function range(start: number, stop: number, step = 1, inclusive = true) {
  return Array(Math.ceil((stop - start) / step) + (inclusive ? 1 : 0))
    .fill(start)
    .map((x: number, y: number) => x + y * step)
}
