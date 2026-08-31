'use client'

import { assert } from '@noaignite/utils'
import type { ReactElement, Ref, RefObject } from 'react'
import { Children, cloneElement, useRef } from 'react'
import { getReactElementRef } from './getReactElementRef'
import { isReactElement } from './isReactElement'
import { isReactFragment } from './isReactFragment'
import { useRefObject } from './useRefObject'

const NAME = '<UseRef />'

export type UseRefProps<T> = {
  ref?: Ref<Element | null>
  initialValue: T
  children: (ref: RefObject<T>) => ReactElement | false | null | undefined
}

/** Component-hook for React {@link useRef}. */
export function UseRef<T>(props: UseRefProps<T>): ReactElement | false | null | undefined

export function UseRef<T>(props: UseRefProps<T | null>): ReactElement | false | null | undefined

export function UseRef<T>(
  props: UseRefProps<T | undefined>,
): ReactElement | false | null | undefined

export function UseRef<T>({
  ref,
  initialValue,
  children,
  ...rest
}: UseRefProps<T>): ReactElement | false | null | undefined {
  const refObject = useRefObject(ref)
  const shouldForwardRef = Boolean(ref)

  const newRef = useRef(initialValue)

  const resolvedChild = typeof children === 'function' ? children(newRef) : children
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
    ...childElement.props,
  })
}
