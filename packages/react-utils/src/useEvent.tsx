import { assert } from '@noaignite/utils'
import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'
import { isRefObject } from './isRefObject'
import { useIsomorphicEffect } from './useIsomorphicEffect'

type EventReference<BaseReference> = BaseReference | null | false | undefined

export type EventOptions = AddEventListenerOptions & {
  /**
   * A `boolean` indicating whether the hook is enabled.
   *
   * @defaultValue true
   */
  when?: boolean
}

/**
 * Adds a native event `listener` of `type` to a `target`.
 * Executes `listener` when the event of type `type` is dispatched.
 *
 * @param target - The target to add the event listener to. Values of type `string` are used instead of their respective global objects to ensure compatibility with server-side rendering.
 * @param type - The event type to listen for, the available options are derived from the `target`.
 * @param listener - The event listener to be called when the event is dispatched.
 * @param options - Configurable options
 *
 * @returns void
 *
 * @example
 * ```tsx
 * const [width, setWidth] = useState<number | null>(null)
 *
 * useEvent('window', 'resize', (event) => {
 *  if (event.defaultPrevented) return
 *  setWidth(window.innerWidth)
 * }, { passive: true })
 * ```
 */
export function useEvent<Type extends keyof WindowEventMap>(
  reference: EventReference<'window'>,
  type: Type,
  listener: (event: WindowEventMap[Type]) => void,
  options?: EventOptions,
): void

export function useEvent<Type extends keyof DocumentEventMap>(
  reference: EventReference<'document'>,
  type: Type,
  listener: (event: DocumentEventMap[Type]) => void,
  options?: EventOptions,
): void

export function useEvent<Type extends keyof VisualViewportEventMap>(
  reference: EventReference<'visualViewport'>,
  type: Type,
  listener: (event: VisualViewportEventMap[Type]) => void,
  options?: EventOptions,
): void

export function useEvent<Type extends keyof MediaQueryListEventMap>(
  reference: EventReference<RefObject<MediaQueryList | null>>,
  type: Type,
  listener: (event: MediaQueryListEventMap[Type]) => void,
  options?: EventOptions,
): void

export function useEvent<Type extends keyof ElementEventMap, E extends Element | null>(
  reference: EventReference<RefObject<E>>,
  type: Type,
  listener: (event: ElementEventMap[Type]) => void,
  options?: EventOptions,
): void

export function useEvent(
  target: EventReference<
    | 'window'
    | 'document'
    | 'visualViewport'
    | RefObject<MediaQueryList | null>
    | RefObject<Element | null>
  >,
  type:
    | keyof WindowEventMap
    | keyof DocumentEventMap
    | keyof VisualViewportEventMap
    | keyof MediaQueryListEventMap
    | keyof HTMLElementEventMap,
  listener: (
    event:
      | WindowEventMap[keyof WindowEventMap]
      | DocumentEventMap[keyof DocumentEventMap]
      | VisualViewportEventMap[keyof VisualViewportEventMap]
      | MediaQueryListEventMap[keyof MediaQueryListEventMap]
      // eslint-disable-next-line @typescript-eslint/no-duplicate-type-constituents -- For symmetry with other parameters
      | ElementEventMap[keyof ElementEventMap],
  ) => void,
  { when = true, capture = false, once = false, passive = false, signal }: EventOptions = {},
) {
  const savedListener = useRef(listener)
  useIsomorphicEffect(() => {
    savedListener.current = listener
  }, [listener])

  useEffect(() => {
    if (!when) return
    if (!target || (isRefObject(target) && !target.current)) return

    let element: Window | Document | VisualViewport | MediaQueryList | Element | null = null

    if (typeof target === 'string') {
      if (target === 'window') {
        element = window
      } else if (target === 'document') {
        element = document
      } else if (visualViewport instanceof VisualViewport) {
        element = visualViewport
      }
    } else if (isRefObject(target)) {
      if (target.current instanceof Element) {
        element = target.current
      } else if (target.current instanceof MediaQueryList) {
        element = target.current
      }
    }

    assert(
      element !== null,
      `Parameter target of useEvent() must be one of the following:\n\n- String: "window", "document", "visualViewport"\n- RefObject: Element | MediaQueryList`,
    )

    // We save the listener to its own variable (`callback`) to ensure that
    // when clean-up runs; that we reference the same pointer in memory.
    const callback = savedListener.current
    const options = { capture, once, passive, signal }

    element.addEventListener(type, callback, options)

    return () => {
      element.removeEventListener(type, callback, options)
    }
  }, [target, type, when, capture, once, passive, signal])
}
