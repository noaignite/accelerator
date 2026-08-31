'use client'

import type { Ref, RefObject } from 'react'
import { useImperativeHandle, useRef } from 'react'

/**
 * Normalize any React `Ref<T>` (forwarded, callback, object, null,
 * undefined) into an equivalent `RefObject<T>`.
 *
 * @param ref - The React ref to normalize.
 * @returns A `RefObject<T | null>` that is kept in sync with the provided `ref`.
 *
 * @example
 * ```tsx
 * const Component = ({ ref }) => {
 *   const refObject = useRefObject(ref);
 *   return <div ref={refObject} />;
 * }
 * ```
 */
export const useRefObject = <T>(ref: Ref<T> | undefined): RefObject<T | null> => {
  const refObject = useRef<T | null>(null)

  useImperativeHandle<T | null, T | null>(ref, () => refObject.current)

  return refObject
}
