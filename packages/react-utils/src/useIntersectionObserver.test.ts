import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { IntersectionObserverMock } from '../test'
import { useIntersectionObserver } from './useIntersectionObserver'

describe('useIntersectionObserver', () => {
  beforeAll(() => {
    global.IntersectionObserver = IntersectionObserverMock
  })

  afterEach(() => {
    IntersectionObserverMock.instances = []
    vi.clearAllMocks()
  })

  it('observes the element and calls callback on intersection', async () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const ref = { current: div }
    const callback = vi.fn()

    renderHook(() => useIntersectionObserver(ref, callback))

    // Wait for observer instantiation
    await waitFor(() => {
      expect(IntersectionObserverMock.instances.length).toBe(1)
    })
    const observer = IntersectionObserverMock.instances[0]

    // Simulate intersection entry
    const fakeEntry = { target: div, isIntersecting: true } as unknown as IntersectionObserverEntry
    act(() => {
      observer?.trigger([fakeEntry])
    })

    expect(callback).toHaveBeenCalledWith(fakeEntry, observer)
  })

  it('does not observe when `when` is false', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const ref = { current: div }
    const callback = vi.fn()

    renderHook(() => useIntersectionObserver(ref, callback, { when: false }))

    expect(IntersectionObserverMock.instances.length).toBe(0)
    expect(callback).not.toHaveBeenCalled()
  })

  it('disconnects on unmount', async () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const ref = { current: div }
    const callback = vi.fn()

    const { unmount } = renderHook(() => useIntersectionObserver(ref, callback))

    await waitFor(() => {
      expect(IntersectionObserverMock.instances.length).toBe(1)
    })
    const observer = IntersectionObserverMock.instances[0]

    unmount()

    expect(observer?.disconnect).toHaveBeenCalled()
  })

  it('stops observing after first intersect when `once` is true', async () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const ref = { current: div }
    const callback = vi.fn()

    renderHook(() => useIntersectionObserver(ref, callback, { once: true }))

    await waitFor(() => {
      expect(IntersectionObserverMock.instances.length).toBe(1)
    })
    const observer = IntersectionObserverMock.instances[0]

    const fakeEntry = { target: div, isIntersecting: true } as unknown as IntersectionObserverEntry
    act(() => observer?.trigger([fakeEntry]))
    expect(callback).toHaveBeenCalledTimes(1)

    // Trigger again; callback should not be invoked again
    act(() => observer?.trigger([fakeEntry]))
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('updates callback when it changes', async () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const ref = { current: div }
    const callback1 = vi.fn()
    const callback2 = vi.fn()

    const { rerender } = renderHook(({ cb }) => useIntersectionObserver(ref, cb), {
      initialProps: { cb: callback1 },
    })

    // Wait for instantiation
    await waitFor(() => {
      expect(IntersectionObserverMock.instances.length).toBe(1)
    })
    const observer = IntersectionObserverMock.instances[0]
    const fakeEntry = { target: div, isIntersecting: true } as unknown as IntersectionObserverEntry

    // Trigger with initial callback
    act(() => observer?.trigger([fakeEntry]))
    expect(callback1).toHaveBeenCalledTimes(1)

    // Rerender with new callback
    rerender({ cb: callback2 })
    act(() => observer?.trigger([fakeEntry]))
    expect(callback1).toHaveBeenCalledTimes(1)
    expect(callback2).toHaveBeenCalledWith(fakeEntry, observer)
  })

  it('passes correct options to IntersectionObserver constructor', async () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const ref = { current: div }
    const callback = vi.fn()
    const options = { root: document.body, rootMargin: '10px', threshold: [0, 0.5] }

    renderHook(() => useIntersectionObserver(ref, callback, options))

    await waitFor(() => {
      expect(IntersectionObserverMock.instances.length).toBe(1)
    })

    const observer = IntersectionObserverMock.instances[0]
    expect(observer?.options).toEqual(options)
  })
})
