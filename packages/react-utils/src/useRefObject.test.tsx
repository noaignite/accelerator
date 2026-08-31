import { render, renderHook } from '@testing-library/react'
import { createRef, forwardRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useRefObject } from './useRefObject'

describe('useRefObject', () => {
  it('is a function', () => {
    expect(useRefObject).toBeTypeOf('function')
  })

  it('converts a `ForwardedRef` object into a synced `RefObject`', () => {
    const forwardedRef = createRef<HTMLDivElement>()

    const Component = forwardRef<HTMLDivElement>(function Component(_props, ref) {
      const refObject = useRefObject<HTMLDivElement>(ref)

      return <div ref={refObject} data-testid="target" />
    })

    const { getByTestId, unmount } = render(<Component ref={forwardedRef} />)

    expect(forwardedRef.current).toBe(getByTestId('target'))

    unmount()

    expect(forwardedRef.current).toBeNull()
  })

  it('converts a `CallbackRef` into a synced `RefObject`', () => {
    const callbackRef = vi.fn()

    function Component() {
      const refObject = useRefObject<HTMLDivElement>(callbackRef)

      return <div ref={refObject} data-testid="target" />
    }

    const { getByTestId, unmount } = render(<Component />)

    expect(callbackRef).toHaveBeenCalledWith(getByTestId('target'))

    unmount()

    expect(callbackRef).toHaveBeenLastCalledWith(null)
  })

  it('returns an assignable `RefObject` when input ref is undefined', () => {
    const { result } = renderHook(() => useRefObject<HTMLDivElement>(undefined))

    expect(result.current).toBeTypeOf('object')
    expect(result.current.current).toBeNull()
  })
})
