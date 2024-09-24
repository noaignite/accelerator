'use client'

import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'
import { useIsomorphicEffect } from './useIsomorphicEffect'

export type UseMutationCallback = (record: MutationRecord) => void

export type MutationObserverOptions = MutationObserverInit & {
  /**
   * A `boolean` indicating whether the hook is enabled.
   *
   * @defaultValue true
   */
  when?: boolean
}

/**
 * Registers a `MutationObserver` on `ref` and executes `callback` when the
 * observed element is mutated.
 *
 * @param ref - A `RefObject` of the element to observe.
 * @param callback - A function to execute when the observed element is mutated.
 * @param options - Configurable options
 *
 * @returns void
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * const [isLoading, setIsLoading] = useState(false);
 *
 * useMutationObserver(ref, (record) => {
 *   setIsLoading(record.attributeName);
 * }, { attributes: true, attributeFilter: ['data-loading'] });
 * ```
 */
export const useMutationObserver = (
  ref: RefObject<Element | null>,
  callback: UseMutationCallback,
  {
    when = true,
    attributeFilter,
    attributeOldValue,
    attributes,
    characterData,
    characterDataOldValue,
    childList,
    subtree,
  }: MutationObserverOptions = {},
) => {
  const savedCallback = useRef(callback)
  useIsomorphicEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (!when) return
    if (!attributes && !characterData && !childList) return

    const element = ref.current
    if (!(element instanceof Element)) return

    const observer = new MutationObserver((records) => {
      const record = records[0]
      if (!record) return

      savedCallback.current(record)
    })

    observer.observe(element, {
      attributeFilter,
      attributeOldValue,
      attributes,
      characterData,
      characterDataOldValue,
      childList,
      subtree,
    })

    return () => {
      observer.disconnect()
    }
  }, [
    ref,
    when,
    attributeOldValue,
    attributes,
    characterData,
    characterDataOldValue,
    childList,
    subtree,
    attributeFilter,
  ])
}
