import type { DistributiveOmit } from './DistributiveOmit'

/**
 * Equivalent to using expression `T & U`, but done without merging the types.
 *
 * @see https://github.com/mui/material-ui/blob/master/packages/mui-types/index.d.ts
 *
 * @example
 * ```tsx
 * type A = { a: string, b: boolean }
 * type B = { a: number, b: boolean }
 *
 * // Regular merge
 * type Merged = A & B // { a: never, b: boolean }
 *
 * // Using Overwrite
 * type Overwritten = Overwrite<A, B> // { a: number, b: boolean }
 * ```
 */
export type Overwrite<T, U> = DistributiveOmit<T, keyof U> & U
