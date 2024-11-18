/**
 * A type helper that returns an array of key-value pairs (entries) for the
 * properties of a given object type `T`. Useful in conjunction with
 * `Object.entries` when one needs to preserve the types of the keys.
 *
 * @example
 * ```ts
 * const breakpoints = {
 *   xs: 500,
 *   md: 1000,
 * }
 *
 * const entries = Object.entries(breakpoints) as Entries<typeof breakpoints>
 *
 * for (const [key, value] of entries) {
 *   console.log(key) // Typed as: "xs" | "md"
 *   console.log(value) // Typed as: "number"
 * }
 * ```
 */
export type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]
