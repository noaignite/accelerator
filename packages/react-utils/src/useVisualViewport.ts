'use client'

import { useCallback, useEffect, useState } from 'react'
import { useEvent } from './useEvent'

export type VisualViewportOptions = {
  /**
   * A `boolean` indicating whether the hook is enabled.
   *
   * @defaultValue true
   */
  when?: boolean
}

const INITIAL_SIZE = {
  height: undefined,
  offsetLeft: undefined,
  offsetTop: undefined,
  pageLeft: undefined,
  pageTop: undefined,
  scale: undefined,
  width: undefined,
}

const getVisualViewport = () => {
  if (typeof window === 'undefined' || !window.visualViewport) return INITIAL_SIZE

  return {
    height: window.visualViewport.height,
    offsetLeft: window.visualViewport.offsetLeft,
    offsetTop: window.visualViewport.offsetTop,
    pageLeft: window.visualViewport.pageLeft,
    pageTop: window.visualViewport.pageTop,
    scale: window.visualViewport.scale,
    width: window.visualViewport.width,
  }
}

/**
 * Tracks `window.visualViewport` which updates on viewport resize.
 *
 * @param options - Configurable options
 *
 * @returns An object containing size information
 *
 * @example
 * ```tsx
 * const { width, height, scale } = useVisualViewport()
 *
 * if (!width) return null
 *
 * return (
 *   <div>
 *     <span>{width} x {height}</span>
 *     <span>{scale > 1 ? 'Zoomed in' : scale < 1 ? 'Zoomed out' : 'No zoom'}</span>
 *   </div>
 * )
 * ```
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API
 */
export const useVisualViewport = ({ when = true }: VisualViewportOptions = {}) => {
  const [visualViewport, setVisualViewport] =
    useState<ReturnType<typeof getVisualViewport>>(INITIAL_SIZE)

  const setNextVisualViewport = useCallback(() => {
    const newVisualViewport = getVisualViewport()

    const areEqual = Object.entries(newVisualViewport).every(
      ([k, v]) => v === visualViewport[k as keyof typeof visualViewport],
    )

    if (areEqual) return

    setVisualViewport(newVisualViewport)
  }, [visualViewport])

  useEffect(() => {
    if (!when) return
    setNextVisualViewport()
  }, [when, setNextVisualViewport])

  useEvent('visualViewport', 'resize', setNextVisualViewport, { when })

  return visualViewport
}
