/**
 * Prevent TypeScript from collapsing a union of number literals into `number`.
 * Useful when union should be part of IntelliSense suggestions, but any `number`
 * value is also accepted.
 *
 * @example
 * type Union = '1' | '2'
 *
 * type Unhinted = Union | number // number
 * type Hinted = HintedString<Union> // 1 | 2 | number
 */
export type HintedNumber<Union extends number> = Union | (number & {})
