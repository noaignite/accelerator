type Separate<T extends string | number, S extends string> = T extends '' ? T : `${S}${T}`

/**
 * Concatenates an array of `string | number` types into a single string.
 * Accepts an optional separator `S` to separate each string.
 *
 * @example
 * ```tsx
 * type Test = Concatenate<['hello', 'world'], ' '>;
 * // 'hello world'
 *
 * type Test2 = Concatenate<['category', 'red-riding-hoodie'], '/'>;
 * // 'category/red-riding-hoodie'
 * ```
 */
export type Concatenate<T extends (string | number)[], S extends string = ''> = T extends [
  infer I extends string | number,
  ...infer A extends (string | number)[],
]
  ? `${I}${Separate<Concatenate<A, S>, S>}`
  : ''
