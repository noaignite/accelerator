import { useEffect, useRef, useState } from 'react'
/**
 * Get dimensions of an element.
 * @returns A tuple containing a ref to the element, the width and the height of the element.
 *
 * @example
 * ```tsx
 * const [elementRef, width, height] = useDimensions<HTMLDivElement>()
 *
 * console.log(width, height) // `100`, `200`
 *
 * return (
 * <div ref={elementRef} />
 * )
 * ```
 */
export function useDimensions<TElementRef extends HTMLElement>() {
  const [width, setWidth] = useState<number | null>(null)
  const [height, setHeight] = useState<number | null>(null)

  const elementRef = useRef<TElementRef>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  useEffect(() => {
    if (elementRef.current) {
      const { width, height } = elementRef.current.getBoundingClientRect()

      setWidth(width)
      setHeight(height)

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.target.getBoundingClientRect()

          setWidth(width)
          setHeight(height)
        }
      })

      resizeObserverRef.current = resizeObserver

      resizeObserver.observe(elementRef.current)
    }
  }, [])

  return [elementRef, width, height] as const
}
