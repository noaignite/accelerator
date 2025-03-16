/* eslint-disable @typescript-eslint/no-explicit-any -- Allow for test files */
import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { ResizeObserverMock } from '../test'
import { useElementSize } from './useElementSize'

describe('useElementSize', () => {
  const initialSizes = {
    clientWidth: 100,
    clientHeight: 50,
    offsetWidth: 120,
    offsetHeight: 60,
    scrollWidth: 200,
    scrollHeight: 80,
  }

  const updatedSizes = {
    clientWidth: 300,
    clientHeight: 150,
    offsetWidth: 320,
    offsetHeight: 160,
    scrollWidth: 400,
    scrollHeight: 180,
  }

  beforeAll(() => {
    global.ResizeObserver = ResizeObserverMock
  })

  afterEach(() => {
    ResizeObserverMock.instances = []
    vi.clearAllMocks()
  })

  it('captures the initial size of the element', async () => {
    const div = document.createElement('div')
    Object.defineProperties(
      div,
      Object.fromEntries(Object.entries(initialSizes).map(([key, value]) => [key, { value }])),
    )
    document.body.appendChild(div)
    const ref = { current: div }

    const { result } = renderHook(() => useElementSize(ref))

    await waitFor(() => {
      expect(result.current).toEqual(initialSizes)
    })
  })

  it('updates when the element size changes', async () => {
    const div = document.createElement('div')
    Object.defineProperties(
      div,
      Object.fromEntries(
        Object.entries(initialSizes).map(([key, value]) => [key, { value, writable: true }]),
      ),
    )
    document.body.appendChild(div)
    const ref = { current: div }

    const { result } = renderHook(() => useElementSize(ref))

    await waitFor(() => {
      expect(result.current.clientWidth).toBe(initialSizes.clientWidth)
    })

    const observer = ResizeObserverMock.instances[0]
    expect(observer).toBeDefined()

    act(() => {
      // Apply updated sizes
      Object.entries(updatedSizes).forEach(([key, value]) => {
        ;(div as any)[key] = value
      })
      observer?.trigger([{ target: div } as any])
    })

    await waitFor(() => {
      expect(result.current).toEqual(updatedSizes)
    })
  })

  it('does not observe or update when `when` is false', () => {
    const div = document.createElement('div')
    Object.defineProperties(div, {
      clientWidth: { value: initialSizes.clientWidth },
      clientHeight: { value: initialSizes.clientHeight },
    })
    document.body.appendChild(div)
    const ref = { current: div }

    const { result } = renderHook(() => useElementSize(ref, { when: false }))

    expect(result.current).toEqual({
      clientWidth: undefined,
      clientHeight: undefined,
      offsetWidth: undefined,
      offsetHeight: undefined,
      scrollWidth: undefined,
      scrollHeight: undefined,
    })
    expect(ResizeObserverMock.instances.length).toBe(0)
  })
})
