/**
 * A type helper that returns an array of keys for the properties of a given
 * object type `T`. Useful in conjunction with `Object.keys` when one needs to
 * preserve the types of the keys.
 *
 * @example
 * ```ts
 * const breakpoints = {
 *   xs: 500,
 *   md: 1000,
 * }
 *
 * const keys = Object.keys(breakpoints) as Keys<typeof breakpoints>
 *
 * for (const key of keys) {
 *   console.log(key) // Typed as: "xs" | "md"
 * }
 * ```
 */
export type Keys<T> = (keyof T)[]
