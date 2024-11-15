'use client'

import type { Prettify } from '@noaignite/types'
import type { RefObject } from 'react'
import { useRef } from 'react'
import { useGesture, type GestureOptions } from './useGesture'
import { useIsomorphicEffect } from './useIsomorphicEffect'

/** Properties to extract from `useGesture` for re-use in this hook. */
type GestureProperties =
  | 'when'
  | 'axis'
  | 'deadZone'
  | 'onGestureStart'
  | 'onGestureMove'
  | 'onGestureEnd'
  | 'pointerType'

export type PressHoldOptions = Prettify<
  Pick<GestureOptions, GestureProperties> & {
    /**
     * The duration in milliseconds that the user must press and hold the element for the gesture
     * to be recognized.
     */
    duration?: number
  }
>

/**
 * Executes `callback` when the user presses and holds `ref` for a specified
 * duration. Additional `options` can be provided to customize the gesture.
 *
 * @param ref - The element to attach the gesture to.
 * @param callback - Function to execute when gesture is complete.
 * @param options - Configurable options
 *
 * @returns void
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 *
 * usePressHold(ref, () => {
 *   console.log('Press and hold gesture complete!');
 * }, { duration: 1000 });
 *
 * return <div ref={ref} />;
 * ```
 */
export const usePressHold = (
  ref: RefObject<Element | null>,
  callback: () => void,
  {
    when = true,
    axis,
    deadZone = 10,
    duration = 850,
    onGestureStart,
    onGestureMove,
    onGestureEnd,
    pointerType,
  }: PressHoldOptions = {},
) => {
  const savedCallback = useRef(callback)
  useIsomorphicEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useGesture(ref, {
    when,
    axis,
    pointerType,
    deadZone,
    lifespan: duration,
    onGestureStart,
    onGestureMove: (event) => {
      onGestureMove?.(event)
      event.abort()
    },
    onGestureEnd: (event) => {
      onGestureEnd?.(event)

      if (event.aborted || !event.expired) return
      savedCallback.current()
    },
  })
}
