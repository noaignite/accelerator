'use client'

import { assert } from '@noaignite/utils'
import type { ReactElement, Ref } from 'react'
import { Children, cloneElement, useId } from 'react'
import { getReactElementRef } from './getReactElementRef'
import { isReactElement } from './isReactElement'
import { isReactFragment } from './isReactFragment'
import { useRefObject } from './useRefObject'

const NAME = '<UseId />'

export type UseIdProps = {
  ref?: Ref<Element | null>
  children: (id: ReturnType<typeof useId>) => ReactElement | false | null | undefined
}

/** Component-hook for React {@link useId}. */
export function UseId({ ref, children, ...rest }: UseIdProps) {
  assert(!('id' in rest), `${NAME} cannot receive an "id" prop.`)

  const refObject = useRefObject(ref)
  const shouldForwardRef = Boolean(ref)

  const id = useId()

  const resolvedChild = typeof children === 'function' ? children(id) : children
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
