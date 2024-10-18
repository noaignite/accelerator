'use client'

import { useCallback, useEffect, useState } from 'react'
import { useEvent } from './useEvent'

export type WindowSizeOptions = {
  /**
   * A `boolean` indicating whether the hook is enabled.
   *
   * @defaultValue true
   */
  when?: boolean
}

const INITIAL_SIZE = {
  innerHeight: undefined,
  innerWidth: undefined,
  outerHeight: undefined,
  outerWidth: undefined,
}

const getSize = () => {
  if (typeof window === 'undefined') return INITIAL_SIZE

  return {
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    outerHeight: window.outerHeight,
    outerWidth: window.outerWidth,
  }
}

/**
 * Tracks `window` size which updates on window resize.
 *
 * @param options - Configurable options
 *
 * @returns An object containing size information
 *
 * @example
 * ```tsx
 * const { innerWidth, innerHeight } = useWindowSize(ref)
 *
 * if (!innerWidth) return null
 * return <div>{innerWidth} x {innerHeight}</div>
 * ```
 */
export const useWindowSize = ({ when = true }: WindowSizeOptions = {}) => {
  const [size, setSize] = useState<ReturnType<typeof getSize>>(INITIAL_SIZE)

  const setNextSize = useCallback(() => {
    const newSize = getSize()
    const areEqual = Object.entries(newSize).every(([k, v]) => v === size[k as keyof typeof size])
    if (areEqual) return

    setSize(newSize)
  }, [size])

  useEffect(() => {
    if (!when) return
    setNextSize()
  }, [when, setNextSize])

  useEvent('window', 'resize', setNextSize, { when })

  return size
}
