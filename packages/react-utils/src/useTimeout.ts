'use client'

import { useEffect } from 'react'
import { useStableCallback } from './useStableCallback'

export type TimeoutOptions = {
  /**
   * A `boolean` indicating whether the hook is enabled.
   *
   * @defaultValue true
   */
  when?: boolean
}

/**
 * Executes `callback` after `delay` milliseconds.
 *
 * @param callback - A function to execute.
 * @param delay - The delay in milliseconds.
 * @param options - Configurable options.
 *
 * @returns void
 *
 * @example
 * ```tsx
 * const [showNewsletterPopup, setShowNewsletterPopup] = useState(false);
 *
 * useTimeout(() => {
 *  setShowNewsletterPopup(true);
 * }, 1000);
 *
 * if (!showNewsletterPopup) return null;
 *
 * return  <aside>...</aside>
 * ```
 */
export const useTimeout = (
  callback: () => void,
  delay: number,
  { when = true }: TimeoutOptions = {},
) => {
  const stableCallback = useStableCallback(callback)

  useEffect(() => {
    if (!when || typeof delay !== 'number') return

    const timeout = setTimeout(() => {
      stableCallback()
    }, delay)

    return () => {
      clearTimeout(timeout)
    }
  }, [when, delay, stableCallback])
}
