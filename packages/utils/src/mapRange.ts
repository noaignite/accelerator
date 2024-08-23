import { clamp as clampFunc } from './clamp'

/**
 * Map a value from one range to another
 *
 * @param value - The value to map
 * @param inMin - The minimum value of the input range
 * @param inMax - The maximum value of the input range
 * @param outMin - The minimum value of the output range
 * @param outMax - The maximum value of the output range
 * @param clamp - Whether to clamp the value to the input range
 * @returns The mapped value
 *
 * @example
 * ```ts
 * mapRange(5, 0, 10, 0, 100) // 50
 * mapRange(15, 0, 10, 0, 100, true) // 100
 * mapRange(5, 0, 10, 0, 4) // 2
 * ```
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  clamp = false,
) {
  const val = clamp ? clampFunc(value, inMin, inMax) : value
  return ((val - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}
