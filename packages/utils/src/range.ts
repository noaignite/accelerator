/**
 * The `range` function generates an array of numbers from a specified starting
 * value to a stopping value, with a defined step size. It can create both
 * inclusive and exclusive ranges based on the provided parameters. This
 * function is useful for generating sequences of numbers for loops,
 * iterations, or other numerical operations.
 *
 * @param start - The starting value of the range.
 * @param stop - The ending value of the range.
 * @param step - The increment between each number in the generated range. Can
 * be a positive or negative number.
 * @param inclusive - If `true`, the stopping value will be included in the
 * generated array. If `false`, the stopping value will be excluded.
 * @returns An array of numbers representing the specified range.
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
