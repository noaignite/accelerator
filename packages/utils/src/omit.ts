/**
 * The `omit` function creates a new object by omitting specified keys from the
 * original object. It takes an object and an array of keys to exclude,
 * returning a new object that contains only the properties not specified in
 * the keys array. This is useful for filtering out sensitive or unnecessary
 * information from an object before using it.
 *
 * @param object - The original object from which keys will be omitted.
 * @param keys - An array of keys (property names) to omit from the original
 * object.
 * @returns A new object that contains all properties of `object` except for
 * those specified in the `keys` array.
 *
 * @example
 * ```ts
 * omit({ a: 1, b: 2, c: 3 }, ['a', 'c']) // { b: 2 }
 * ```
 */
export function omit<T extends Record<PropertyKey, unknown>, K extends keyof T>(
  object: T,
  keys: K[],
) {
  const entries = Object.entries(object) as [K, unknown][]
  const filtered = entries.filter(([key]) => !keys.includes(key))
  const result = Object.fromEntries(filtered) as Omit<T, K>

  return result
}
