import type { Overwrite } from './Overwrite'

/**
 * Generates a string union type from a given object type of all keys whose values are `boolean`.
 *
 * @internal
 */
type GenerateStringUnion<T> = Extract<
  {
    [Key in keyof T]: true extends T[Key] ? Key : never
  }[keyof T],
  string
>

/**
 * Generate a set of string literal types with the given default record `T` and
 * override record `U`.
 *
 * If the property value was `true`, the property key will be added to the
 * string union.
 *
 * @see https://github.com/mui/material-ui/blob/master/packages/mui-types/index.d.ts
 */
export type OverridableStringUnion<T extends string | number, U = {}> = GenerateStringUnion<
  Overwrite<Record<T, true>, U>
>
