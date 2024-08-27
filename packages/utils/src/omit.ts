/**
 * Omit keys from object.
 *
 * @param object - Object to omit keys from.
 * @param keys - Array of keys to omit from object.
 * @returns Object with omitted keys.
 *
 * @example
 * ```ts
 * omit({ a: 1, b: 2, c: 3 }, ['a', 'c']) // { b: 2 }
 * ```
 */
export default function omit<T extends Record<PropertyKey, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
) {
  const entries = Object.entries(obj) as [K, unknown][]
  const filtered = entries.filter(([key]) => !keys.includes(key))
  const result = Object.fromEntries(filtered) as Omit<T, K>

  return result
}
