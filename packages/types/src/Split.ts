/**
 * Split a string into an array of substrings using the specified separator
 * and return the result.
 *
 * @example
 * ```ts
 * type T0 = Split<'a-b-c', '-'>; // ['a', 'b', 'c']
 * type T1 = Split<'a-b-c', '.'>; // ['a-b-c']
 * type T2 = Split<'a-b-c', ''>; // ['a', '-', 'b', '-', 'c']
 * ```
 */
export type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends ''
    ? []
    : S extends `${infer T}${D}${infer U}`
      ? [T, ...Split<U, D>]
      : [S]
