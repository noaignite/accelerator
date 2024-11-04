/**
 * Normalizes a value to an array.
 *
 * If the input is already an array, it is returned as-is. If the input is a
 * single value, it is wrapped in an array. If the input is `undefined`, an
 * empty array is returned.
 *
 * @param value - The value to normalize.
 * @returns An array containing the input value(s), or an empty array.
 *
 * @example
 * ```ts
 * normalizeToArray(5); // [5]
 * normalizeToArray('foo'); // ['foo']
 * normalizeToArray([1, false]); // [1, false]
 * normalizeToArray(undefined); // []
 * ```
 */
export function normalizeToArray<T>(value: T | T[] | undefined): T[] {
  if (Array.isArray(value)) return value
  return value === undefined ? [] : [value]
}
