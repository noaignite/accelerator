/**
 * The `normalize` function scales a value within a specific range to a
 * normalized range between `0` and `1`. Given an input value and a range
 * (`minimum` to `maximum`), it calculates the proportion of the value relative
 * to the range. This is useful for standardizing data, making it easier to
 * work with values across different scales.
 *
 * @param value - The value to be normalized within the range.
 * @param minimum - The minimum value of the range.
 * @param maximum - The maximum value of the range.
 * @returns The normalized value between `0` and `1`.
 *
 * @example
 * ```ts
 * // Normalize a value within the range [0, 100]
 * normalize(50, 0, 100)); // 0.5
 * // Normalize a value in a custom range [10, 20]
 * normalize(15, 10, 20)); // 0.5
 * // Normalize a value below the minimum (the function doesn't clamp)
 * normalize(5, 10, 20)); // -0.5
 * // Normalize a value above the maximum
 * normalize(25, 10, 20)); // 1.5
 * ```
 */
export function normalize(value: number, minimum: number, maximum: number) {
  return (value - minimum) / (maximum - minimum)
}
