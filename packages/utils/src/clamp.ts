/**
 * Clamps a value between a minimum and maximum value.
 *
 * @param value - The value to clamp.
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns The clamped value.
 *
 * @example
 * ```ts
 * clamp(5, 0, 10) // 5
 * clamp(15, 0, 10) // 10
 * clamp(-5, 0, 10) // 0
 * ```
 */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
