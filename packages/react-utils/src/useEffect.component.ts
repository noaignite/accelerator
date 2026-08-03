'use client'

import { assert } from '@noaignite/utils'
import type { DependencyList, EffectCallback, ReactElement, Ref } from 'react'
import { Children, cloneElement, useEffect } from 'react'
import { getReactElementRef } from './getReactElementRef'
import { isReactElement } from './isReactElement'
import { isReactFragment } from './isReactFragment'
import { useRefObject } from './useRefObject'

const NAME = '<UseEffect />'

export type UseEffectProps = {
  ref?: Ref<Element | null>
  effect: EffectCallback
  deps?: DependencyList
  children: ReactElement | false | null | undefined
}

/** Component-hook for React {@link useEffect}. */
export function UseEffect({ ref, effect, deps, children, ...rest }: UseEffectProps) {
  const refObject = useRefObject(ref)
  const shouldForwardRef = Boolean(ref)

  // eslint-disable-next-line react-hooks/exhaustive-deps -- Unknowable
  useEffect(effect, deps)

  const resolvedChild = children
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
