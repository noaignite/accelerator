/**
 * Checks if a given value is a plain `object` (POJO).
 *
 * @param value - The value to check.
 * @returns `true` if the value is a plain object, `false` otherwise.
 *
 * @example
 * ```ts
 * isPlainObject({}) // true
 * isPlainObject(new Date()) // false
 * isPlainObject([]) // false
 * ```
 *
 * @see https://github.com/sindresorhus/is-plain-obj/blob/main/index.js
 */
export function isPlainObject(value: unknown): value is Record<PropertyKey, unknown> {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const prototype = Object.getPrototypeOf(value) as unknown
  return (
    (prototype === null ||
      prototype === Object.prototype ||
      Object.getPrototypeOf(prototype) === null) &&
    !(Symbol.toStringTag in value) &&
    !(Symbol.iterator in value)
  )
}
