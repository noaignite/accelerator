/**
 * Generates a tuple type of length `N` where each element is of type `T`.
 *
 * @example
 * type Test = Repeat<'foo', 3>;
 * // ['foo', 'foo', 'foo']
 */
export type Repeat<T, N extends number, R extends unknown[] = []> = R['length'] extends N
  ? R
  : Repeat<T, N, [T, ...R]>
