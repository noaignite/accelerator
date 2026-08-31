import { isObject } from '@noaignite/utils'
import type { ReactElement } from 'react'
import { isValidElement } from 'react'

/**
 * Checks whether `x` is of type `ReactElement`.

 * @param x - Value to check
 * @returns `true` if `x` is a `ReactElement`, `false` otherwise.
 *
 * @example
 * ```ts
 * const value = <div />
 * isReactElement(value) // true
 * ```
 */
export const isReactElement = (x: unknown): x is ReactElement<Record<string, unknown>> =>
  isValidElement(x) && isObject(x.props)
