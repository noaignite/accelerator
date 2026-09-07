'use client'

import type { RefObject } from 'react'
import { useEffect } from 'react'
import { useStableCallback } from './useStableCallback'

export type UseMutationCallback = (record: MutationRecord) => void

export type MutationObserverOptions = MutationObserverInit & {
  /**
   * A `boolean` indicating whether the hook is enabled.
   *
   * @default true
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
 * @param options.when - Whether observation is enabled.
 * @param options.attributeFilter - Attribute names to observe.
 * @param options.attributeOldValue - Whether to record previous attribute values.
 * @param options.attributes - Whether to observe attribute changes.
 * @param options.characterData - Whether to observe character-data changes.
 * @param options.characterDataOldValue - Whether to record previous character data.
 * @param options.childList - Whether to observe child-list changes.
 * @param options.subtree - Whether to observe all descendants.
 * @returns void
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
  const stableCallback = useStableCallback(callback)

  useEffect(() => {
    if (!when) return
    if (!attributes && !characterData && !childList) return

    const element = ref.current
    if (!(element instanceof Element)) return

    const observer = new MutationObserver((records) => {
      const record = records[0]
      if (!record) return

      stableCallback(record)
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
    stableCallback,
  ])
}
