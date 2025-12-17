'use client'

import { clamp } from '@noaignite/utils'
import { type RefObject, useCallback, useEffect, useRef } from 'react'
import { useIntersectionObserver } from './useIntersectionObserver'
import { useIsomorphicEffect } from './useIsomorphicEffect'

/**
 * Returns the vertical scroll progress of a target within a container (0–1).
 *
 * Progress is `0` when fully below the container and `1` when fully above, with optional
 * top/bottom offsets for fine-tuning.
 *
 * @param targetRect - Bounding rect of the target element.
 * @param containerRect - Bounding rect of the scroll container.
 * @param topOffset - Offset from the container's top (default: 0).
 * @param bottomOffset - Offset from the container's bottom (default: topOffset).
 */
function getVerticalScrollProgress(
  targetRect: DOMRect,
  containerRect: DOMRect,
  topOffset = 0,
  bottomOffset = topOffset,
) {
  const availableHeight = containerRect.height + targetRect.height - (topOffset + bottomOffset)
  const relativeBottom = targetRect.bottom - containerRect.top - topOffset
  if (availableHeight <= 0) return relativeBottom <= 0 ? 1 : 0

  const rawProgress = 1 - relativeBottom / availableHeight

  return clamp(rawProgress, 0, 1)
}

/**
 * Data provided to the scroll progress callback.
 */
export type UseScrollProgressEntry = {
  /**
   * Progress relative to the element’s own height (0–1).
   */
  innerProgress: number
  /**
   * Progress relative to the container/viewport (0–1).
   */
  outerProgress: number
  /**
   * The observed target element.
   */
  target: HTMLElement | null
}

/**
 * Callback type invoked with scroll progress data.
 */
export type UseScrollProgressCallback = (entry: UseScrollProgressEntry) => void

/**
 * Options for `useScrollProgress`.
 *
 * Extends `IntersectionObserverInit` with extra settings for smoothing and control.
 */
export type UseScrollProgressOptions = IntersectionObserverInit & {
  /**
   * Custom scroll container. Defaults to `window` (viewport).
   */
  container?: HTMLElement | null
  /**
   * Enables/disables the hook.
   *
   * @defaultValue true
   */
  when?: boolean
}

/**
 * Registers a "scroll observer" on `ref` and executes `callback` when
 * the observed element is scrolled inside the viewport.
 *
 * @param ref - Ref of the element to observe.
 * @param callback - Callback invoked with progress data.
 * @param options - Configuration (friction, precision, observer options, etc.).
 * @returns void
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 *
 * useScrollProgress(ref, (entry) => {
 *   console.log('The element\'s inner progress is:', entry.innerProgress)
 *   console.log('The element\'s outer progress is:', entry.outerProgress)
 * })
 * ```
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  callback: UseScrollProgressCallback,
  options: UseScrollProgressOptions = {},
) {
  const { container, root, rootMargin, threshold, when = true } = options

  const isInViewRef = useRef(false)
  const rafRef = useRef<number>(null)

  const stableCallback = useRef(callback)
  useIsomorphicEffect(() => {
    stableCallback.current = callback
  }, [callback])

  /**
   * Recalculates target scroll progress values for the observed element.
   */
  const update = useCallback(
    (force = false) => {
      if (!(ref.current instanceof Element)) return
      if (!force && !isInViewRef.current) return

      // Get bounding rect of the target element.
      const targetRect = ref.current.getBoundingClientRect()

      // Determine scroll container.
      const docEl = document.documentElement
      const containerEl = container ?? docEl

      // Get container’s bounding rect.
      const containerRect =
        containerEl === docEl
          ? new DOMRect(0, 0, docEl.clientWidth, docEl.clientHeight)
          : containerEl.getBoundingClientRect()

      // Calculate max offset (for inner progress) as the smaller of
      // element height or container height.
      const maxOffset = Math.min(ref.current.clientHeight, containerRect.height)

      // Compute outer scroll progress relative to container.
      const outerProgress = getVerticalScrollProgress(targetRect, containerRect)

      // Compute inner scroll progress relative to element’s own height.
      const innerProgress = getVerticalScrollProgress(targetRect, containerRect, maxOffset)

      // Trigger the user callback with updated progress values.
      stableCallback.current({
        innerProgress,
        outerProgress,
        target: ref.current,
      })
    },
    [container, ref],
  )

  /**
   * Queues one scroll-progress update on the next animation frame.
   */
  const scheduleUpdate = useCallback(() => {
    if (rafRef.current !== null) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      update()
    })
  }, [update])

  /**
   * Observe the element's visibility using IntersectionObserver.
   */
  useIntersectionObserver(
    ref,
    (entry) => {
      isInViewRef.current = entry.isIntersecting
      update(true)
    },
    { root: root ?? container, rootMargin, threshold, when },
  )

  /**
   * Attach scroll and resize listeners when active (`when` is true).
   */
  useEffect(() => {
    if (!when) return

    // Initial progress calculation on mount.
    update(true)

    // Determine the scroll event target.
    const scrollContainer = container ?? window

    // Attach event listeners to update progress.
    scrollContainer.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    // Cleanup: remove event listeners on unmount or when dependencies change
    return () => {
      scrollContainer.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [container, scheduleUpdate, update, when])
}
