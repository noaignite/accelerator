import { renderHook } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { useStableCallback } from './useStableCallback'

test('returns a stable reference across rerenders', () => {
  const { result, rerender } = renderHook(({ callback }) => useStableCallback(callback), {
    initialProps: { callback: () => 1 },
  })

  const stable = result.current
  rerender({ callback: () => 2 })

  expect(result.current).toBe(stable)
})

test('invokes the latest callback when dependencies change', () => {
  const first = vi.fn(() => 'first')
  const second = vi.fn(() => 'second')

  const { result, rerender } = renderHook(({ callback }) => useStableCallback(callback), {
    initialProps: { callback: first },
  })

  expect(result.current()).toBe('first')
  expect(first).toHaveBeenCalledTimes(1)

  rerender({ callback: second })

  expect(result.current()).toBe('second')
  expect(second).toHaveBeenCalledTimes(1)
  expect(first).toHaveBeenCalledTimes(1)
})

test('forwards arguments to the latest callback', () => {
  const { result, rerender } = renderHook(
    ({ value }) => useStableCallback((delta: number) => value + delta),
    {
      initialProps: { value: 2 },
    },
  )

  expect(result.current(3)).toBe(5)

  rerender({ value: 10 })
  expect(result.current(4)).toBe(14)
})
