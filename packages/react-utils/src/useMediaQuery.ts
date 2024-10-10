'use client'

import { useRef, useState } from 'react'
import { useEvent } from './useEvent'
import { useIsomorphicEffect } from './useIsomorphicEffect'

export type MediaQueryOptions = {
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
 * Returns a `boolean` indicating whether the passed media query matches current
 * device / viewport state.
 *
 * @param media - A valid media query string
 * @param options - Configurable options
 *
 * @returns
 * - `true` if media query matches
 * - `false` if media query does not match
 * - `undefined` on initial render / server-side
 *
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 640px)')
 *
 * if (isMobile === undefined) return <Loader />
 * return isMobile ? <MobileLayout /> : <DesktopLayout />
 * ```
 */
export const useMediaQuery = (
  media: string,
  { initialValue, when = true }: MediaQueryOptions = {},
) => {
  const ref = useRef<MediaQueryList | null>(null)

  const [isMatching, setIsMatching] = useState(initialValue)

  useIsomorphicEffect(() => {
    if (!when) return

    setIsMatching(matchMedia(media).matches)

    ref.current = window.matchMedia(media)

    return () => {
      ref.current = null
    }
  }, [when, media])

  useEvent(
    ref,
    'change',
    () => {
      setIsMatching(matchMedia(media).matches)
    },
    { when },
  )

  return isMatching
}
