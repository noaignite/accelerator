/**
 * Generates a tuple type of length `N` where each element is of type `T`.
 * If `N` is `number[]`, it will generate a tuple for each number in the array.
 *
 * @example
 * ```tsx
 * type Test = Repeat<'foo', 3>
 * // ['foo', 'foo', 'foo']
 *
 * type Test = Repeat<'foo', [1, 2]>
 * // ['foo'] | ['foo', 'foo']
 * ```
 */
export type Repeat<T, N extends number | number[], R extends unknown[] = []> = N extends number[]
  ? N[number] extends infer U
    ? U extends number
      ? Repeat<T, U>
      : never
    : never
  : N extends number
    ? R['length'] extends N
      ? R
      : Repeat<T, N, [T, ...R]>
    : never
