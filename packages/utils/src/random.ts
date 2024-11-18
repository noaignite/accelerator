/**
 * Generates a random number between `min` and `max`.
 *
 * @param min - The minimum value of the range (inclusive).
 * @param max - The maximum value of the range (inclusive).
 * @param floating - A boolean indicating if the result should be a
 * floating-point number.
 * @returns A random number between `min` and `max`.
 *
 * @example
 * ```ts
 * random(1, 10); // Outputs an integer between 1 and 10
 * random(1.5, 5.5); // Outputs an integer between 1 and 5
 * random(1.5, 5.5, true); // Outputs a float between 1.5 and 5.5
 * ```
 */
export function random(min: number, max: number, floating?: boolean): number {
  const rand = Math.random() * (max - min) + min
  return floating ? rand : Math.floor(rand)
}
