'use client'

import type { RefObject } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useMutationObserver } from './useMutationObserver'

export type RTLOptions = {
  /**
   * An element reference which will used determine the local directionality.
   * Use when the document and the element have different directionality values.
   */
  ref?: RefObject<Element | null>
  /**
   * The initially returned value when the hook is first rendered.
   * Useful when the most likely value is known ahead of time, as it may
   * mitigate a flash of content in certain controlled scenarios.
   *
   * @defaultValue `undefined`
   */
  initialValue?: boolean
  /**
   * A `boolean` indicating whether the hook is enabled.
   *
   * @defaultValue `true`
   */
  when?: boolean
}

/**
 * Traverse DOM-tree toward root element and find the closest parent
 * with an explicit `dir` attribute set. In the instance of no `dir`,
 * the `<html />` or `document.documentElement` is returned.
 */
const deriveObservableElement = (ref?: RefObject<Element | null>) => {
  if (typeof window === 'undefined') return null

  if (!ref?.current) return document.documentElement
  if (ref.current.hasAttribute('dir')) return ref.current

  let parent = ref.current.parentElement

  while (parent && parent.tagName !== 'HTML' && !parent.hasAttribute('dir')) {
    parent = parent.parentElement
  }

  return parent ?? document.documentElement
}

/**
 * Return a `boolean` indicating whether the page is in RTL (right-to-left) mode
 * with the option to observe a specific element.
 *
 * @remarks This hook __does not__ consider directionality defined via CSS, only
 * semantic directionality defined via the `dir` attribute.
 *
 * @param options - Configurable options
 *
 * @returns
 * - `true` if document or local directionality is RTL
 * - `false` if document or local directionality is LTR
 * - `undefined` on initial render / server-side
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLUListElement>(null)
 *
 * const isGlobalRTL = useRTL()
 * const isLocalRTL = useRTL({ ref })
 *
 * return (
 *   <ul ref={ref} dir="rtl">
 *     <li>Global: {isGlobalRTL ? 'RTL' : 'LTR'}</li>
 *     <li>Local: {isLocalRTL ? 'RTL' : 'LTR'}</li>
 *   </ul>
 * )
 * ```
 */
export const useRTL = ({ ref, initialValue, when = true }: RTLOptions = {}) => {
  const targetRef = useRef<Element | null>(null)

  const [isRTL, setIsRTL] = useState(initialValue)

  useEffect(() => {
    const element = deriveObservableElement(ref)
    targetRef.current = element

    if (!(element instanceof Element)) return
    setIsRTL(element.getAttribute('dir') === 'rtl')
  }, [ref])

  const mutationCallback = useCallback((record: MutationRecord) => {
    const { target, type, attributeName } = record

    if (!(target instanceof Element)) return
    if (type !== 'attributes' || attributeName !== 'dir') return

    setIsRTL(target.getAttribute('dir') === 'rtl')
  }, [])

  useMutationObserver(targetRef, mutationCallback, {
    when,
    attributes: true,
    attributeFilter: ['dir'],
  })

  return isRTL
}
