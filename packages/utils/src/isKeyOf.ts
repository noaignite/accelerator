/**
 * Checks whether a given key exists directly on an object.
 *
 * This only matches own properties and does not consider keys inherited through
 * the prototype chain.
 *
 * Use this when you have a computed key and need TypeScript to narrow that key
 * to `keyof T` for safe indexed access. This is especially useful in cases
 * where `key in obj` confirms the runtime check but does not narrow the key
 * enough for `obj[key]` to type-check.
 *
 * @param obj - The object to check.
 * @param key - The property key to look up.
 * @returns `true` if `key` is an own key of `obj`, `false` otherwise.
 *
 * @example
 * ```ts
 * const reports = {
 *   reportDaily: { total: 1 },
 *   reportWeekly: { total: 7 },
 * }
 *
 * const period = 'Daily' as 'Daily' | 'Weekly' | 'Monthly'
 * const reportKey = `report${period}` as const
 *
 * if (isKeyOf(reports, reportKey)) {
 *   reports[reportKey] // type-safe
 * }
 * ```
 */
export function isKeyOf<T extends object>(obj: T, key: PropertyKey): key is keyof T {
  return Object.hasOwn(obj, key)
}
