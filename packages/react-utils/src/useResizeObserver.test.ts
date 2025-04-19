import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { ResizeObserverMock } from '../test'
import { useResizeObserver } from './useResizeObserver'

describe('useResizeObserver', () => {
  beforeAll(() => {
    global.ResizeObserver = ResizeObserverMock
  })

  afterEach(() => {
    ResizeObserverMock.instances = []
    vi.clearAllMocks()
  })

  it('observes the element and calls callback on resize', async () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const ref = { current: div }
    const callback = vi.fn()

    renderHook(() => useResizeObserver(ref, callback))

    // Wait for observer instantiation
    await waitFor(() => {
      expect(ResizeObserverMock.instances.length).toBe(1)
    })
    const observer = ResizeObserverMock.instances[0]

    // Simulate a resize entry
    const fakeEntry = { target: div } as unknown as ResizeObserverEntry
    act(() => {
      observer?.trigger([fakeEntry])
    })

    expect(callback).toHaveBeenCalledWith(fakeEntry)
  })

  it('does not observe when `when` is false', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const ref = { current: div }
    const callback = vi.fn()

    renderHook(() => useResizeObserver(ref, callback, { when: false }))

    expect(ResizeObserverMock.instances.length).toBe(0)
    expect(callback).not.toHaveBeenCalled()
  })

  it('updates callback when it changes', async () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const ref = { current: div }
    const callback1 = vi.fn()
    const callback2 = vi.fn()

    const { rerender } = renderHook(({ cb }) => useResizeObserver(ref, cb), {
      initialProps: { cb: callback1 },
    })

    // Trigger with initial callback
    await waitFor(() => {
      expect(ResizeObserverMock.instances.length).toBe(1)
    })
    const observer = ResizeObserverMock.instances[0]
    const fakeEntry = { target: div } as unknown as ResizeObserverEntry
    act(() => observer?.trigger([fakeEntry]))
    expect(callback1).toHaveBeenCalledTimes(1)

    // Rerender with new callback
    rerender({ cb: callback2 })
    act(() => observer?.trigger([fakeEntry]))
    expect(callback1).toHaveBeenCalledTimes(1)
    expect(callback2).toHaveBeenCalledWith(fakeEntry)
  })

  it('disconnects on unmount', async () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const ref = { current: div }
    const callback = vi.fn()

    const { unmount } = renderHook(() => useResizeObserver(ref, callback))

    await waitFor(() => {
      expect(ResizeObserverMock.instances.length).toBe(1)
    })
    const observer = ResizeObserverMock.instances[0]

    unmount()

    expect(observer?.disconnect).toHaveBeenCalled()
  })
})
