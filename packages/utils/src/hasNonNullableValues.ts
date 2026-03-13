/**
 * Checks if values of given keys are non-nullable.
 *
 * Could be useful when the [Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) method
 * doesn't properly infer your predicate function.
 *
 * @example
 * ```ts
 *  const entries = [
 *    {
 *      key1: null,
 *      key2: '01-value2' as const
 *    },
 *    {
 *      key1: '02-value1' as const,
 *      key2: '02-value2' as const
 *    }
 *  ]
 *
 * entries.filter((entry) => hasNonNullableValues(entry, ['key1', 'key2'])) // [{key1: '02-value1', key2: '02-value2'}]
 * ```
 */
export const hasNonNullableValues = <T extends Record<PropertyKey, unknown>, K extends keyof T>(
  obj: T,
  keys: Array<K>,
): obj is T & { [key in K]-?: NonNullable<T[key]> } => {
  return (
    Boolean(obj) && keys.every((key) => key in obj && obj[key] !== undefined && obj[key] !== null)
  )
}
