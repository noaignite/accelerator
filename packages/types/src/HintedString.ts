/**
 * Prevent TypeScript from collapsing a union of string literals into `string`.
 * Useful when union should be part of IntelliSense suggestions, but any `string`
 * value is also accepted.
 *
 * @example
 * ```tsx
 * type Union = 'foo' | 'bar'
 *
 * type Unhinted = Union | string // string
 * type Hinted = HintedString<Union> // 'foo' | 'bar' | string
 * ```
 */
export type HintedString<Union extends string> = Union | (string & {})
