'use client'

import { useEffect } from 'react'
import { useStableCallback } from './useStableCallback'

export type IntervalOptions = {
  /**
   * A `boolean` indicating whether the hook is enabled.
   *
   * @defaultValue true
   */
  when?: boolean
}

/**
 * Executes `callback` every `delay` milliseconds.
 *
 * @param callback - A function to execute.
 * @param delay - The delay in milliseconds.
 * @param options - Configurable options.
 *
 * @returns void
 *
 * @example
 * ```tsx
 * const livePriceUpdate = () => { ... }
 *
 * useInterval(livePriceUpdate, 1000);
 * ```
 */
export const useInterval = (
  callback: () => void,
  delay: number,
  { when = true }: IntervalOptions = {},
) => {
  const stableCallback = useStableCallback(callback)

  useEffect(() => {
    if (!when || typeof delay !== 'number') return

    const interval = setInterval(() => {
      stableCallback()
    }, delay)

    return () => {
      clearInterval(interval)
    }
  }, [when, delay, stableCallback])
}
