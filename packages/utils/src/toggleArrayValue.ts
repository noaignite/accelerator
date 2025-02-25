/**
 * toggles the presence of a value in an array.
 *
 * @param array - The array to toggle the value in.
 * @param value - The value to toggle in the array.
 * @returns A new array with the value added if not present, or removed if
 * present.
 *
 * @example
 * ```ts
 * toggleArrayValue([1, 'foo', true], 1); // ['foo', true]
 * toggleArrayValue([1, 'foo', true], true); // [1, 'foo']
 * toggleArrayValue([1, 'foo', true], 'baz'); // [1, 'foo', true, 'baz']
 * ```
 */
export function toggleArrayValue<T>(array: T[], value: T): T[] {
  return array.includes(value) ? array.filter((item) => item !== value) : [...array, value]
}
