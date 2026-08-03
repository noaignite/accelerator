import { Fragment } from 'react'
import { isReactElement } from './isReactElement'

/**
 * Checks whether `x` is of type `Fragment`.
 *
 * @param x - Value to check
 * @returns `true` if `x` is a `Fragment`, `false` otherwise.
 *
 * @example
 * ```ts
 * const value = <></>
 * isReactFragment(value) // true
 * ```
 */
export const isReactFragment = (x: unknown): x is typeof Fragment =>
  x === Fragment || (isReactElement(x) && x.type === Fragment)
