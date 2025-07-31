'use client'

import type { RefObject } from 'react'
import { useEffect } from 'react'
import { useStableCallback } from './useStableCallback'

export type UseResizeObserverCallback = (entry: ResizeObserverEntry) => void

export type ResizeObserverOptions = {
  /**
   * A `boolean` indicating whether the hook is enabled.
   *
   * @defaultValue true
   */
  when?: boolean
}

/**
 * Registers a `ResizeObserver` on `ref` and executes `callback` when the
 * observed element is resized.
 *
 * @param ref - A `RefObject` of the element to observe.
 * @param callback - A function to execute when the observed element is resized.
 * @param options - Configurable options
 *
 * @returns void
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLElement>(null);
 * const [size, setSize] = useState({ width: 0, height: 0 });
 *
 * useResizeObserver(ref, (entry) => setSize({
 *   width: entry.contentRect.width,
 *   height: entry.contentRect.height,
 * }));
 * ```
 */
export const useResizeObserver = (
  ref: RefObject<Element | null>,
  callback: UseResizeObserverCallback,
  { when = true }: ResizeObserverOptions = {},
) => {
  const stableCallback = useStableCallback(callback)

  useEffect(() => {
    if (!when) return

    const element = ref.current
    if (!(element instanceof Element)) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return

      stableCallback(entry)
    })

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [ref, when, stableCallback])
}
