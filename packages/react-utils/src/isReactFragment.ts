import type { ComponentProps, ReactElement } from 'react'
import { Fragment } from 'react'
import { isReactElement } from './isReactElement'

/**
 * Checks whether `x` is the React `Fragment` token or a React element whose type is `Fragment`.
 *
 * @param x - Value to check
 * @returns `true` for the `Fragment` token or a fragment element, `false` otherwise.
 *
 * @example
 * ```tsx
 * import { isReactFragment } from '@noaignite/react-utils'
 * import { Fragment } from 'react'
 *
 * isReactFragment(Fragment) // true
 * isReactFragment(<><span>Hello</span></>) // true
 * isReactFragment(<div />) // false
 * ```
 */
export const isReactFragment = (
  x: unknown,
): x is typeof Fragment | ReactElement<ComponentProps<typeof Fragment>, typeof Fragment> =>
  x === Fragment || (isReactElement(x) && x.type === Fragment)
