'use client'

import { assert } from '@noaignite/utils'
import { Children, cloneElement, type ReactElement, type Ref } from 'react'
import { getReactElementRef } from './getReactElementRef'
import { isReactElement } from './isReactElement'
import { isReactFragment } from './isReactFragment'
import type { RTLOptions } from './useRTL'
import { useRTL } from './useRTL'
import { useRefObject } from './useRefObject'

const NAME = '<UseRTL />'

export type UseRTLProps = RTLOptions & {
  ref?: Ref<Element | null>
  children:
    ReactElement | ((rtl: ReturnType<typeof useRTL>) => ReactElement | false | null | undefined)
  /** Should directionality be determined from provided `ref` element? */
  scoped?: boolean
}

/**
 * Component-hook for Accelerator {@link useRTL}.
 *
 * @param root0 - Component props.
 * @param root0.ref - Ref forwarded to the child element.
 * @param root0.children - Child element or render function receiving directionality.
 * @param root0.initialValue - Initial directionality before observing the DOM.
 * @param root0.scoped - Whether to track directionality from the child element.
 * @param root0.when - Whether to observe directionality changes.
 * @returns The child with directionality attributes and merged props, or a falsy value.
 */
export function UseRTL({
  ref,
  children,
  initialValue,
  scoped = false,
  when = true,
  ...rest
}: UseRTLProps) {
  const refObject = useRefObject(ref)
  const shouldForwardRef = Boolean(ref) || scoped || typeof children !== 'function'

  const isRTL = useRTL({
    ref: scoped ? refObject : undefined,
    initialValue,
    when,
  })

  const resolvedChild = typeof children === 'function' ? children(isRTL) : children
  if ([false, null, undefined].some((x) => x === resolvedChild)) return resolvedChild

  const childElements = Children.toArray(resolvedChild)
  assert(childElements.length === 1, `${NAME} can only render one child.`)

  const childElement = childElements[0]

  assert(isReactElement(childElement), `${NAME} child must be a "ReactElement".`)
  assert(
    !getReactElementRef(childElement),
    `${NAME} child cannot have a "ref" set. Set "ref" on ${NAME} instead.`,
  )

  if (isReactFragment(childElement)) {
    assert(!shouldForwardRef, `${NAME} cannot render a "Fragment" when a "ref" must be attached.`)
    return childElement
  }

  return cloneElement(childElement, {
    ref: shouldForwardRef ? refObject : undefined,
    ...rest,
    'data-ltr': !isRTL ? '' : undefined,
    'data-rtl': isRTL ? '' : undefined,
    ...childElement.props,
  })
}
