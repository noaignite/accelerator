'use client'

import { useMemo } from 'react'
import { setRef } from './setRef'

/**
 * Useful if you want to merge multiple refs into a single ref.
 *
 * @param refs - An array of refs.
 * @example
 * ```tsx
 * const forkedRef = useForkRef(ref1, ref2);
 * const forkedRef = useForkRef(ref1, ref2, ref3);
 * ```
 */
export function useForkRef<Instance>(
  ...refs: (React.Ref<Instance> | undefined)[]
): React.RefCallback<Instance> | null {
  /**
   * This will create a new function if the refs passed to this hook change and are all defined.
   * This means react will call the old forkRef with `null` and the new forkRef
   * with the ref. Cleanup naturally emerges from this behavior.
   */
  return useMemo(() => {
    if (refs.every((ref) => ref == null)) {
      return null
    }

    return (instance) => {
      refs.forEach((ref) => {
        setRef(ref, instance)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- TODO: Uncomment once we enable eslint-plugin-react-compiler
  }, refs)
}
