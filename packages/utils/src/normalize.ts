/**
 * Normalize a value between a range
 *
 * @param value - The value to normalize
 * @param min - The minimum value of the range
 * @param max - The maximum value of the range
 * @returns The normalized value
 *
 * @example
 * ```ts
 * normalize(5, 0, 10) // 0.5
 * normalize(5, 0, 5) // 1
 * ```
 */
export default function normalize(value: number, min: number, max: number) {
  return (value - min) / (max - min)
}
