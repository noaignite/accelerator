/**
 * Removes `readonly` from array or tuple literal types.
 *
 * @example
 * ```tsx
 * const test = [1, 2, 3] as const
 * const test2 = { a: 'a', b: 'b' } as const;
 *
 * type Test = Writeable<typeof test>; // [1, 2, 3]
 * type Test2 = Writeable<typeof test2>; // { a: 'a', b: 'b' }
 * ```
 */
export type Writeable<T> = { -readonly [P in keyof T]: T[P] }
