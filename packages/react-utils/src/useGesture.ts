'use client'

import type { RefObject } from 'react'
import { useRef } from 'react'
import { useEvent } from './useEvent'

/** The current position of pointer device at a given time during the gesture. */
export type GesturePosition = {
  /** Current horizontal position in relation to viewport. */
  x: number
  /** Current vertical position in relation to viewport. */
  y: number
}

/** The pointer device rate of travel in both axes. Calculated between move events. */
export type GestureMovement = {
  /** The rate of travel in the horizontal axis. */
  movementX: number
  /** The rate of travel in the vertical axis. */
  movementY: number
}

/** The delta between current pointer position in relation to initial gesture position. */
export type GestureDelta = {
  /** The delta in the horizontal axis. */
  deltaX: number
  /** The delta in the vertical axis. */
  deltaY: number
}

/** The general direction pointer device is traveling over the course of the gesture. */
export type GestureDirection = 'up' | 'right' | 'down' | 'left' | null

/** The type of pointer device used for the current gesture. */
export type GesturePointerType = 'mouse' | 'touch' | 'pen'

/** A synthetic gesture event that is triggered when the pointer pressed down. */
export interface GestureStartEvent extends GesturePosition {
  /** Underlying native `pointerdown` event executed at the time of `GestureStartEvent`. */
  nativeEvent: PointerEvent
  /** The type of pointer device used for the current gesture. */
  pointerType: GesturePointerType
  /**
   * A function aborting current gesture immediately, preventing further synthetic gesture
   * events for the duration of the gesture until pointer device is released.
   */
  abort: () => void
}

/** A synthetic gesture event that is triggered when the pointer device is pressed down and moving. */
export interface GestureMoveEvent extends GesturePosition, GestureMovement, GestureDelta {
  /** Underlying native `pointermove` event executed at the time of `GestureMoveEvent`. */
  nativeEvent: PointerEvent
  /** The type of pointer device used for the current gesture. */
  pointerType: GesturePointerType
  /** The duration in milliseconds since the gesture started. */
  duration: number
  /** The general direction pointer device is traveling over the course of the gesture. */
  direction: GestureDirection
  /**
   * A function aborting current gesture immediately, preventing further synthetic gesture
   * events for the duration of the gesture until pointer device is released.
   */
  abort: () => void
}

/** A synthetic gesture event that is triggered when the pointer device is released. */
export interface GestureEndEvent extends GesturePosition, GestureMovement, GestureDelta {
  /** Underlying native `pointerend` event executed at the time of `GestureEndEvent`. */
  nativeEvent: PointerEvent
  /** The type of pointer device used for the current gesture. */
  pointerType: GesturePointerType
  /** The duration in milliseconds since the gesture started. */
  duration: number
  /** The general direction pointer device is traveling over the course of the gesture. */
  direction: GestureDirection
  /** A `boolean` indicating whether the gesture was aborted. */
  aborted: boolean
  /** A `boolean` indicating whether the gesture has expired. */
  expired: boolean
}

export type GestureOptions = {
  /**
   * A `boolean` indicating whether the hook is enabled.
   *
   * @defaultValue true
   */
  when?: boolean
  /**
   * A `string` indicating the axis on which the gesture should be performed on.
   * If not supplied, both axes are considered.
   */
  axis?: 'x' | 'y'
  /**
   * A `string` indicating the type of pointer device that should trigger the gesture.
   * If not supplied, all pointer devices are considered.
   */
  pointerType?: GesturePointerType
  /**
   * A `number` indicating the dead zone in pixels that must be crossed before a gesture
   * is considered valid.
   *
   * @defaultValue 3
   */
  deadZone?: number
  /**
   * A `number` indicating the lifespan in milliseconds that a gesture is alive.
   * If not supplied, the gesture is considered alive until the pointer is released.
   */
  lifespan?: number
  /**
   * A callback function that is invoked when a gesture is initiated by pressing
   * down on the pointer device.
   */
  onGestureStart?: (event: GestureStartEvent) => void
  /**
   * A callback function that is invoked when a gesture has past the `deadZone`
   * threshold and the pointer device is moving.
   */
  onGestureMove?: (event: GestureMoveEvent) => void
  /**
   * A callback function that is invoked when a gesture is terminated by releasing
   * the pointer device.
   */
  onGestureEnd?: (event: GestureEndEvent) => void
}

/**
 * Attaches synthetic gesture events on the provided `ref` whose triggers can
 * be constrained via `axis`, `pointerType`, `deadZone`, and `lifespan`
 * options.
 *
 * When a valid gesture is detected, `onGestureStart`, `onGestureMove`, and
 * `onGestureEnd` callbacks are invoked, allowing for custom behavior to be
 * implemented.
 *
 * If a gesture is deemed invalid, the gesture can be aborted by calling the
 * `abort` method on the returned `event` object, in which case the
 * `onGestureEnd` callback is called immediately.
 *
 * @param ref - A `RefObject` of the element to observe.
 * @param options - Configurable options
 *
 * @returns void
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null)
 *
 * useGesture(ref, {
 *   onGestureStart: ({ x, y }) => console.log('Gesture started at:', x, y),
 *   onGestureMove: ({ deltaX, deltaY }) => console.log('Gesture moved by:', deltaX, deltaY),
 *   onGestureEnd: ({ deltaX, deltaY }) => console.log('Gesture ended at:', deltaX, deltaY)
 * })
 *
 * return <div ref={ref} />
 * ```
 */
export const useGesture = (
  ref: RefObject<Element | null>,
  {
    when = true,
    axis,
    pointerType,
    deadZone = 3,
    lifespan,
    onGestureStart,
    onGestureMove,
    onGestureEnd,
  }: GestureOptions = {},
) => {
  const startPosition = useRef<GesturePosition>({ x: 0, y: 0 })
  const startTime = useRef<number | null>(null)

  const previous = useRef<GestureDelta & GestureMovement>({
    deltaX: 0,
    deltaY: 0,
    movementX: 0,
    movementY: 0,
  })

  const offset = useRef<GesturePosition>({ x: 0, y: 0 })

  const isLocked = useRef(true)

  const previousDirection = useRef<GestureDirection>(null)

  const lifespanTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  function abort(event: PointerEvent) {
    handleGestureEnd(event, 'abort')
  }

  function handleGestureStart(event: PointerEvent) {
    if (pointerType && event.pointerType !== pointerType) return
    if (event.button !== 0) return

    document.addEventListener('pointermove', handleGestureMove)
    document.addEventListener('pointerup', handleGestureEnd)

    startTime.current = performance.now()
    startPosition.current = { x: event.x, y: event.y }

    if (typeof lifespan === 'number') {
      lifespanTimer.current = setTimeout(() => {
        handleGestureEnd(event, 'expire')
      }, lifespan)
    }

    onGestureStart?.({
      nativeEvent: event,
      ...startPosition.current,
      pointerType: event.pointerType as GesturePointerType,
      abort: () => {
        abort(event)
      },
    })
  }

  function handleGestureMove(event: PointerEvent) {
    event.preventDefault()

    const { x, y, movementX, movementY } = event
    let dX = !axis || axis === 'x' ? x - startPosition.current.x : 0
    let dY = !axis || axis === 'y' ? y - startPosition.current.y : 0

    previous.current = { ...previous.current, movementX, movementY }

    // Calculate the distance moved from the start position
    const distance = Math.sqrt(dX * dX + dY * dY)

    // Prevent accidental Gestures by ensuring distance is greater than deadZone
    if (isLocked.current) {
      if (distance < deadZone) {
        offset.current = { x: dX, y: dY }
        return
      }

      isLocked.current = false
    }

    dX -= offset.current.x
    dY -= offset.current.y

    previous.current = { ...previous.current, deltaX: dX, deltaY: dY }

    // Determine the most significant current directionality of the Gesture
    let direction: GestureDirection = null

    const directionFromAxis = {
      x: movementX > 0 ? 'right' : 'left',
      y: movementY > 0 ? 'down' : 'up',
      determine: Math.abs(movementX) > Math.abs(movementY) ? 'x' : 'y',
    } as const

    if (axis) direction = directionFromAxis[axis]
    if (!axis) direction = directionFromAxis[directionFromAxis.determine]

    previousDirection.current = direction

    onGestureMove?.({
      nativeEvent: event,
      pointerType: event.pointerType as GesturePointerType,
      duration: Math.round(performance.now() - (startTime.current ?? 0)),
      direction,
      x,
      y,
      movementX,
      movementY,
      deltaX: dX,
      deltaY: dY,
      abort: () => {
        abort(event)
      },
    })
  }

  function handleGestureEnd(event: PointerEvent, reason?: 'expire' | 'abort') {
    document.removeEventListener('pointermove', handleGestureMove)
    document.removeEventListener('pointerup', handleGestureEnd)

    const { x, y } = event

    onGestureEnd?.({
      nativeEvent: event,
      pointerType: event.pointerType as GesturePointerType,
      duration: Math.round(performance.now() - (startTime.current ?? 0)),
      direction: previousDirection.current,
      aborted: reason === 'abort',
      expired: reason === 'expire',
      x,
      y,
      ...previous.current,
    })

    startPosition.current = { x: 0, y: 0 }
    startTime.current = null

    previous.current = { deltaX: 0, deltaY: 0, movementX: 0, movementY: 0 }
    offset.current = { x: 0, y: 0 }

    isLocked.current = true

    previousDirection.current = null

    clearTimeout(lifespanTimer.current)
    lifespanTimer.current = undefined
  }

  useEvent(ref, 'pointerdown', handleGestureStart, { when })
}
