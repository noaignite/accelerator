/**
 * The `pick` function creates a new object by selecting specified keys from
 * the original object. It takes an object and an array of keys to include,
 * returning a new object that contains only the properties specified in the
 * keys array. This is useful for extracting relevant data from an object while
 * ignoring other properties.
 *
 * @param object - The original object from which keys will be selected.
 * @param keys - An array of keys (property names) to include in the new object.
 * @returns A new object that contains only the properties of `object` specified
 * in the `keys` array.
 *
 * @example
 * ```ts
 * pick({ a: 1, b: 2, c: 3 }, ['a', 'c']) // { a: 1, c: 3 }
 * ```
 */
export function pick<T extends Record<PropertyKey, unknown>, K extends keyof T>(
  object: T,
  keys: K[],
) {
  const entries = Object.entries(object) as [K, unknown][]
  const filtered = entries.filter(([key]) => keys.includes(key))
  const result = Object.fromEntries(filtered) as Pick<T, K>

  return result
}
