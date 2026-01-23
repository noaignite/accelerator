'use client'

import { useCallback, useRef } from 'react'
import { useIsomorphicEffect } from './useIsomorphicEffect'

/**
 * Returns a memoized version of your function that maintains a stable
 * reference, but also can read the latest scope (props and state) of the
 * component in which it is used. Useful for preventing unnecessary re-renders.
 *
 * @param callback - Function to stabilize
 *
 * @remarks
 * As opposed to `useCallback` which recreates callback when dependencies change,
 * `useStableCallback` does not recreate the callback itself, but rather the
 * reference to it. You will always get the latest version of the callback.
 *
 * @example
 * ```tsx
 * const stableCallback = useStableCallback(() => getRandomValue())
 * stableCallback()
 * // always returns the latest value, but the reference to the
 * // callback itself is stable and never changes
 * ```
 */
export const useStableCallback = <A extends unknown[], T>(callback: (...args: A) => T) => {
  const savedCallback = useRef(callback)

  useIsomorphicEffect(() => {
    savedCallback.current = callback
  }, [callback])

  return useCallback((...args: A) => savedCallback.current(...args), [])
}
