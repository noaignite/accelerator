/**
 * Checks if a given value is of type `object`.
 *
 * @param value - The value to check.
 * @returns `true` if the value is of type `object`, `false` otherwise.
 *
 * @example
 * ```ts
 * isObject({}) // true
 * isObject(new Date()) // true
 * isObject([]) // true
 * isObject(2) // false
 * ```
 */
export const isObject = (value: unknown): value is object =>
  typeof value === 'object' && value !== null
