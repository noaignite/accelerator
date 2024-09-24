/**
 * The `clamp` function restricts a number to lie within a specified range. If
 * the value is less than the minimum, it returns the minimum. If the value is
 * greater than the maximum, it returns the maximum. Otherwise, it returns the
 * value itself. This is useful for ensuring that a value stays within a
 * defined boundary.
 *
 * @param value - The number to be clamped within the range.
 * @param minimum - The lower bound of the range. The returned value will not be
 * less than this number.
 * @param maximum - The upper bound of the range. The returned value will not be
 * greater than this number.
 * @returns The clamped value, constrained within the range defined by `min`
 * and `max`.
 *
 * @example
 * ```ts
 * clamp(5, 0, 10) // 5
 * clamp(15, 0, 10) // 10
 * clamp(-5, 0, 10) // 0
 * ```
 */
export function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum)
}
