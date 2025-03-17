'use client'

import type { RefObject } from 'react'
import { useIsomorphicEffect } from './useIsomorphicEffect'

export type FocusReturnOptions = {
  /**
   * An optional reference element to return focus to when `when` is `false`.
   * Useful for cases where more custom focus behavior is needed, or when the
   * the triggering element is no longer in the DOM.
   */
  returnTo?: RefObject<HTMLElement | null>
}

/**
 * Records currently focused element and returns focus to it when `when` is
 * set to `false`.
 *
 * @param when - When `true`, focus is recorded. When `false`, focus is returned.
 * @param options - Configurable options
 *
 * @returns void
 *
 *  @example
 * ```tsx
 * const [isDialogOpen, setIsDialogOpen] = useState(false)
 *
 * useFocusReturn(isDialogOpen)
 *
 * return (
 *   <Dialog open={isDialogOpen} onClose={setIsDialogOpen} />
 * )
 * ```
 */
export const useFocusReturn = (when: boolean, { returnTo }: FocusReturnOptions = {}) => {
  useIsomorphicEffect(() => {
    if (!when) return

    const activeElement = document.activeElement
    const returnElement = returnTo?.current

    return () => {
      // In some cases, return element may not be interactive by the time this cleanup
      // runs. We delay focus return at end of event loop.
      setTimeout(() => {
        if (returnElement instanceof HTMLElement) {
          returnElement.focus()
        } else if (activeElement instanceof HTMLElement) {
          activeElement.focus()
        }
      }, 0)
    }
  }, [when, returnTo])
}
