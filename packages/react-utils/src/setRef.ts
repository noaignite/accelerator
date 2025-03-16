import type { RefObject } from 'react'

/**
 * Useful if you want to expose the ref of an inner component to the public API
 * while still using it inside the component.
 *
 * @param ref - A ref callback or ref object. If anything falsy, this is a no-op.
 */
export function setRef<T>(
  ref: RefObject<T | null> | ((instance: T | null) => void) | null | undefined,
  value: T | null,
): void {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref) {
    ref.current = value
  }
}
