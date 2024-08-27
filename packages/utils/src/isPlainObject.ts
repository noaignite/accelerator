/**
 * Check if the given item is a plain object.
 *
 * @param item - The item to check.
 * @returns `true` if the item is a plain object, `false` otherwise.
 *
 * @example
 * ```ts
 * isPlainObject({}) // true
 * isPlainObject({ foo: 'bar' }) // true
 * isPlainObject([]) // false
 * ```
 *
 * @see https://github.com/sindresorhus/is-plain-obj/blob/main/index.js
 */
export default function isPlainObject(item: unknown): item is Record<PropertyKey, unknown> {
  if (typeof item !== 'object' || item === null) {
    return false
  }

  const prototype = Object.getPrototypeOf(item) as unknown
  return (
    (prototype === null ||
      prototype === Object.prototype ||
      Object.getPrototypeOf(prototype) === null) &&
    !(Symbol.toStringTag in item) &&
    !(Symbol.iterator in item)
  )
}
