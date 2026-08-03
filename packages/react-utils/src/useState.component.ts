'use client'

import { assert } from '@noaignite/utils'
import type { Dispatch, ReactElement, Ref, SetStateAction } from 'react'
import { Children, cloneElement, useState } from 'react'
import { getReactElementRef } from './getReactElementRef'
import { isReactElement } from './isReactElement'
import { isReactFragment } from './isReactFragment'
import { useRefObject } from './useRefObject'

const NAME = '<UseState />'

export type UseStateProps<S> = {
  ref?: Ref<Element | null>
  initialState: S | (() => S)
  children: (props: [S, Dispatch<SetStateAction<S>>]) => ReactElement | false | null | undefined
}

/** Component-hook for React {@link useState}. */
export function UseState<S>({ ref, children, initialState, ...rest }: UseStateProps<S>) {
  const refObject = useRefObject(ref)
  const shouldForwardRef = Boolean(ref)

  const state = useState(initialState)

  const resolvedChild = typeof children === 'function' ? children(state) : children
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
