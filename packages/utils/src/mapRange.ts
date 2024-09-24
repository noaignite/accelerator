import { clamp as clampFunc } from './clamp'

/**
 * The `mapRange` function remaps a number from one range to another. It takes
 * a value in a given range (`inMin` to `inMax`) and maps it to a corresponding
 * value in a target range (`outMin` to `outMax`). This function also
 * optionally clamps the input value to ensure it stays within the input range
 * before mapping, preventing values outside the range.
 *
 * @param value - The number to be mapped from the input range to the output
 * range.
 * @param inMin - The lower bound of the input range.
 * @param inMax - The upper bound of the input range.
 * @param outMin - The lower bound of the output range.
 * @param outMax - The upper bound of the output range.
 * @param clamp - If `true`, the input value will be clamped to stay within the
 * `inMin` to `inMax` range. If `false` or omitted, the value will be mapped
 * regardless of whether it falls outside the input range.
 * @returns The value mapped from the input range to the output range. If
 * `clamp` is `true`, the returned value will always correspond to a value
 * between `outMin` and `outMax`.
 *
 * @example
 * ```ts
 * // Map a value from the range [0, 100] to [0, 1]
 * mapRange(50, 0, 100, 0, 1) // 0.5
 * // Map a value from the range [0, 100] to [0, 1000] with clamping
 * mapRange(150, 0, 100, 0, 1000, true) // 1000 (clamped)
 * // Map a value from [10, 20] to [100, 200]
 * mapRange(15, 10, 20, 100, 200) // 150
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
