'use client'

import { assert } from '@noaignite/utils'
import { useCallback, useEffect, useState, type RefObject } from 'react'
import { useIntersectionObserver } from './useIntersectionObserver'
import { useMutationObserver } from './useMutationObserver'
import { useRTL } from './useRTL'

type StickySide = 'top' | 'right' | 'bottom' | 'left'

type StickyProperties = {
  /**
   * The inset value to account for when determining stickiness,
   * based on target style-declaration
   */
  inset: number
  /**
   * The side which a target ought to stick to, based on target
   * style-declarations.
   */
  side: StickySide
}

export type StickyOptions = {
  /**
   * A `RefObject` which points to a custom container element. If provided,
   * the target will be assumed stick to this container instead of the viewport.
   */
  container?: RefObject<HTMLElement | null>
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
   * @defaultValue true
   */
  when?: boolean
}

/**
 * Returns the sticky properties of a target element, based on its style-declarations.
 */
const getProperties = (ref: RefObject<HTMLElement | null>): StickyProperties | null => {
  const element = ref.current
  if (!(element instanceof HTMLElement)) return null

  const computedStyles = getComputedStyle(element)
  const sides: StickySide[] = ['top', 'left', 'bottom', 'right']

  assert(
    computedStyles.position === 'sticky',
    'Reference element must have a position of `sticky` in order to be used with `useSticky`.',
  )

  const { offsetHeight, offsetWidth } = element

  for (const side of sides) {
    const inset = parseInt(computedStyles[side])
    if (isNaN(inset)) continue

    const isVertical = ['top', 'bottom'].includes(side)
    const offset = isVertical ? offsetHeight : offsetWidth

    return { side, inset: inset * -1 - offset }
  }

  return null
}

/**
 * Returns a `boolean` indicating whether referenced element is currently
 * _stuck_ to viewport or a custom `container`.
 *
 * @remarks __Does not support__ elements with variable positioning using CSS
 * `env()` function as it can cause infinite re-renders.
 *
 * @param ref - The element to monitor for stickiness.
 * @param options - Configurable options
 *
 * @returns A `boolean` indicating whether the element is currently _stuck_.
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null)
 * const isSticky = useSticky(ref)
 *
 * return (
 *   <div
 *     ref={ref}
 *     style={{
 *       position: 'sticky',
 *       marginTop: '25px',
 *       top: '50px',
 *       background: isSticky ? 'green' : 'crimson'
 *     }}
 *   >
 *     Content
 *   </div>
 * )
 * ```
 */
export const useSticky = (
  ref: RefObject<HTMLElement | null>,
  { container, initialValue, when = true }: StickyOptions = {},
) => {
  const [isStuck, setIsStuck] = useState(initialValue)
  const [properties, setProperties] = useState<StickyProperties | null>(null)
  const [isI1Intersecting, setIsI1Intersecting] = useState(false)

  const isRTL = useRTL({ ref })

  const { side, inset } = properties ?? {}

  const handleI1Callback = useCallback((entry: IntersectionObserverEntry) => {
    setIsI1Intersecting(entry.isIntersecting)
  }, [])

  useIntersectionObserver(ref, handleI1Callback, {
    when,
    root: container?.current,
    rootMargin: `${inset ?? 0}px`,
  })

  const handleI2Callback = useCallback(
    ({ isIntersecting: isI2Intersecting }: IntersectionObserverEntry) => {
      if (!when || !side) return

      if (isI1Intersecting && !isI2Intersecting) {
        const parent = container?.current
        const element = ref.current
        if (!(element instanceof HTMLElement)) return

        const pRect =
          parent?.getBoundingClientRect() ??
          new DOMRect(0, 0, window.innerWidth, window.innerHeight)

        const cRect = element.getBoundingClientRect()

        const isStuckTo = {
          top: () => Math.abs(cRect.top - pRect.top) < Math.abs(cRect.bottom - pRect.bottom),
          left: () => Math.abs(cRect.left - pRect.left) < Math.abs(cRect.right - pRect.right),
          bottom: () => Math.abs(cRect.top - pRect.top) > Math.abs(cRect.bottom - pRect.bottom),
          right: () => Math.abs(cRect.left - pRect.left) > Math.abs(cRect.right - pRect.right),
        }

        setIsStuck(isStuckTo[side]())
        return
      }

      setIsStuck(false)
    },
    [ref, container, isI1Intersecting, when, side],
  )

  useIntersectionObserver(ref, handleI2Callback, {
    when: when && isI1Intersecting,
    root: container?.current,
    rootMargin: `${(inset ?? 0) - 1}px`,
  })

  const handleMutation = useCallback(() => {
    setProperties(getProperties(ref))
  }, [ref])

  useMutationObserver(ref, handleMutation, {
    when,
    attributes: true,
    attributeFilter: ['id', 'class', 'style'],
  })

  useEffect(() => {
    if (!when || !ref.current) return

    const newProperties = getProperties(ref)
    if (properties?.inset === newProperties?.inset && properties?.side === newProperties?.side) {
      return
    }

    setProperties(newProperties)
  }, [when, ref, isRTL, properties?.inset, properties?.side])

  return isStuck
}
