/**
 * Pick keys from object.
 *
 * @param object - Object to pick keys from.
 * @param keys - Array of keys to pick from object.
 *
 * @example
 * ```ts
 * pick({ a: 1, b: 2, c: 3 }, ['a', 'c']) // { a: 1, c: 3 }
 * ```
 */
export default function pick<T extends Record<PropertyKey, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
) {
  const entries = Object.entries(obj) as [K, unknown][]
  const filtered = entries.filter(([key]) => keys.includes(key))
  const result = Object.fromEntries(filtered) as Pick<T, K>

  return result
}
