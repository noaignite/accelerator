import { isObject } from '@noaignite/utils'
import type { RefObject } from 'react'

/**
 * Checks if a given value is of type `RefObject`.
 *
 * @param value - The value to check.
 * @returns `true` if the value is of type `RefObject`, `false` otherwise.
 *
 * @example
 * ```ts
 * const ref = useRef<HTMLDivElement>(null)
 *
 * isRefObject(ref) // true
 * isRefObject({}) // false
 * isRefObject(window) // false
 * ```
 */
export const isRefObject = (value: unknown): value is RefObject<unknown> =>
  isObject(value) && 'current' in value
