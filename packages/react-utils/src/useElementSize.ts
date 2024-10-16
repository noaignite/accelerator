'use client'

import type { RefObject } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useResizeObserver } from './useResizeObserver'

export type ElementSizeOptions = {
  /**
   * A `boolean` indicating whether the hook is enabled.
   *
   * @defaultValue true
   */
  when?: boolean
}

const INITIAL_SIZE = {
  clientHeight: undefined,
  clientWidth: undefined,
  offsetHeight: undefined,
  offsetWidth: undefined,
  scrollHeight: undefined,
  scrollWidth: undefined,
}

const getSize = (ref?: RefObject<HTMLElement | null>) => {
  const element = ref?.current

  if (!element) return INITIAL_SIZE

  return {
    clientHeight: element.clientHeight,
    clientWidth: element.clientWidth,
    offsetHeight: element.offsetHeight,
    offsetWidth: element.offsetWidth,
    scrollHeight: element.scrollHeight,
    scrollWidth: element.scrollWidth,
  }
}

/**
 * Tracks a `ref` element size which updates on element resize.
 *
 * @param ref - An element reference to measure
 * @param options - Configurable options
 *
 * @returns An object containing size information
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null)
 * const { clientWidth, clientHeight } = useElementSize(ref)
 *
 * return (
 *   <div ref={ref}>
 *     {innerWidth ? `${innerWidth} x ${innerHeight}` : 'Loading...'}
 *   </div>
 * )
 * ```
 */
export const useElementSize = (
  ref: RefObject<HTMLElement | null>,
  { when = true }: ElementSizeOptions = {},
) => {
  const [size, setSize] = useState<ReturnType<typeof getSize>>(INITIAL_SIZE)

  const setNextSize = useCallback(() => {
    if (!ref.current) return

    const newSize = getSize(ref)
    const areEqual = Object.entries(newSize).every(([k, v]) => v === size[k as keyof typeof size])
    if (areEqual) return

    setSize(newSize)
  }, [ref, size])

  useEffect(() => {
    if (!when) return
    setNextSize()
  }, [when, ref, setNextSize])

  const resizeCallback = useCallback(() => {
    setNextSize()
  }, [setNextSize])

  useResizeObserver(ref, resizeCallback, { when })

  return size
}
