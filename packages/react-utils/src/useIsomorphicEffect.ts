import { useEffect, useLayoutEffect } from 'react'

/**
 * A utility hook that runs `useLayoutEffect` on the client and `useEffect` on
 * the server. This is useful in applications that pre-render on the server and
 * then rehydrate on the client; as running `useLayoutEffect` on the server
 * will result in an error / warning.
 *
 * @see https://react.dev/reference/react/useLayoutEffect
 * @see https://react.dev/reference/react/useEffect
 */
export const useIsomorphicEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect
