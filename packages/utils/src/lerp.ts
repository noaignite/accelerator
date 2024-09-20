/**
 * The `lerp` (linear interpolation) function calculates a value between a
 * start and an end point, based on a given interpolation amount. The `amount`
 * parameter represents the position between `start` and `end`, where `0`
 * returns the start value, `1` returns the end value, and values between 0
 * and 1 return points in between. This is commonly used in animation,
 * movement, or smoothing transitions.
 *
 * @param start - The starting value of the interpolation.
 * @param end - The ending value of the interpolation.
 * @param amount - A value between `0` and `1` representing the interpolation
 * factor.
 * @returns The interpolated value between start and end, calculated based on
 * the amount provided.
 *
 * @example
 * ```ts
 * lerp(0, 100, 0) // 0
 * lerp(0, 100, 0.5) // 50
 * lerp(0, 100, 0.75) // 75
 * lerp(10, 20, 0.75) // 17.5
 * ```
 */
export function lerp(start: number, end: number, amount: number) {
  return (1 - amount) * start + amount * end
}
