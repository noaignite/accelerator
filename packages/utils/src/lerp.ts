/**
 * Linear interpolation between two numbers.
 *
 * @param start - The start value.
 * @param end - The end value.
 * @param amount - The amount to interpolate between the two values.
 * @returns The interpolated value.
 *
 * @example
 * ```ts
 * lerp(0, 100, 0.5) // 50
 * lerp(0, 100, 0.75) // 75
 * ```
 */
export default function lerp(start: number, end: number, amount: number) {
  return (1 - amount) * start + amount * end
}
