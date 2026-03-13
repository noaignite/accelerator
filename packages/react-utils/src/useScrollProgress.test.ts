import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { IntersectionObserverMock, ResizeObserverMock } from '../test'
import type { UseScrollProgressEntry } from './useScrollProgress'
import { useScrollProgress } from './useScrollProgress'

/**
 * useScrollProgress observes a ref’s element and calls a callback with scroll progress (inner/outer 0–1)
 * as the user scrolls or when the container/viewport resizes. These tests use observer mocks to drive
 * that behavior without real layout.
 */
describe('useScrollProgress', () => {
  // Use mocks instead of real observers so we can:
  // - Trigger callbacks on demand via .trigger(entries) instead of relying on real viewport/scroll
  // - Inspect observer options (e.g. root, rootMargin) via .options
  // - Avoid flaky layout-dependent behavior in tests
  beforeAll(() => {
    global.IntersectionObserver = IntersectionObserverMock
    global.ResizeObserver = ResizeObserverMock
  })

  // Each constructor call pushes an instance to .instances; reset between tests so we always get the right one.
  afterEach(() => {
    IntersectionObserverMock.instances = []
    ResizeObserverMock.instances = []
    vi.clearAllMocks()
  })

  it('invokes callback with entry shape (innerProgress, outerProgress, target) when element is in view', async () => {
    // Proves: when the observed element enters view (IntersectionObserver fires), the callback receives
    // an entry with innerProgress, outerProgress, and target, and both progress values are in [0, 1].

    const target = document.createElement('div')
    document.body.appendChild(target) // Must be in DOM so ref.current is an element and getBoundingClientRect exists.
    const ref = { current: target } // RefObject shape the hook expects.
    const callback = vi.fn<(entry: UseScrollProgressEntry) => void>()

    // Hook computes progress from getBoundingClientRect and clientHeight; mock them for deterministic results.
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 50, 100, 100))
    vi.spyOn(target, 'clientHeight', 'get').mockReturnValue(100)

    renderHook(() => useScrollProgress(ref, callback))

    // Wait for the hook’s effect to run and create the IntersectionObserver (pushed to .instances).
    await waitFor(() => {
      expect(IntersectionObserverMock.instances.length).toBe(1)
    })
    const io = IntersectionObserverMock.instances[0]
    // Trigger the observer’s callback as if the element became visible; hook then runs update(true) and calls our callback.
    act(() => {
      io?.trigger([{ target, isIntersecting: true } as unknown as IntersectionObserverEntry])
    })

    await waitFor(() => {
      expect(callback).toHaveBeenCalled()
    })
    const entry = callback.mock.calls[0]?.[0]
    expect(entry).toBeDefined()
    // Entry must have the documented shape: target element + two progress numbers.
    expect(entry).toMatchObject({
      target,
      innerProgress: expect.any(Number),
      outerProgress: expect.any(Number),
    })
    // Progress is defined to be clamped to [0, 1].
    expect(entry!.innerProgress).toBeGreaterThanOrEqual(0)
    expect(entry!.innerProgress).toBeLessThanOrEqual(1)
    expect(entry!.outerProgress).toBeGreaterThanOrEqual(0)
    expect(entry!.outerProgress).toBeLessThanOrEqual(1)
  })

  it('invokes callback on scroll when using viewport', async () => {
    // Proves: with default options (no container), scrolling the window causes the hook to recalculate and call the callback.

    const target = document.createElement('div')
    document.body.appendChild(target)
    const ref = { current: target }
    const callback = vi.fn<(entry: UseScrollProgressEntry) => void>()

    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 100, 100, 200))
    vi.spyOn(target, 'clientHeight', 'get').mockReturnValue(200)

    renderHook(() => useScrollProgress(ref, callback))

    await waitFor(() => {
      expect(IntersectionObserverMock.instances.length).toBe(1)
    })
    const io = IntersectionObserverMock.instances[0]
    // Element must be “in view” (isIntersecting: true) or the hook skips scroll updates.
    act(() => {
      io?.trigger([{ target, isIntersecting: true } as unknown as IntersectionObserverEntry])
    })
    callback.mockClear() // Ignore the call from the trigger above; we only care about the scroll-driven call.

    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })
    // The hook uses requestAnimationFrame to throttle; we must flush one frame so the scheduled update runs.
    await act(async () => {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve())
      })
    })

    expect(callback).toHaveBeenCalled()
  })

  it('invokes callback on window resize when using viewport (no container)', async () => {
    // Proves: with no custom container, the hook listens to window "resize"; when viewport size changes, progress is recalculated.

    const target = document.createElement('div')
    document.body.appendChild(target)
    const ref = { current: target }
    const callback = vi.fn<(entry: UseScrollProgressEntry) => void>()

    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 100, 100))
    vi.spyOn(target, 'clientHeight', 'get').mockReturnValue(100)

    renderHook(() => useScrollProgress(ref, callback))

    await waitFor(() => {
      expect(IntersectionObserverMock.instances.length).toBe(1)
    })
    const io = IntersectionObserverMock.instances[0]
    act(() => {
      io?.trigger([{ target, isIntersecting: true } as unknown as IntersectionObserverEntry])
    })
    callback.mockClear()

    act(() => {
      window.dispatchEvent(new Event('resize'))
    })
    await act(async () => {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve())
      })
    })

    expect(callback).toHaveBeenCalled()
  })

  it('invokes callback on scroll when using custom container', async () => {
    // Proves: when a custom container is passed, the scroll listener is on that element; scrolling it triggers the callback.

    const container = document.createElement('div')
    const target = document.createElement('div')
    container.appendChild(target)
    document.body.appendChild(container)
    const ref = { current: target }
    const callback = vi.fn<(entry: UseScrollProgressEntry) => void>()

    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 50, 100, 100))
    vi.spyOn(target, 'clientHeight', 'get').mockReturnValue(100)
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 100, 200))

    renderHook(() => useScrollProgress(ref, callback, { container }))

    await waitFor(() => {
      expect(IntersectionObserverMock.instances.length).toBe(1)
    })
    const io = IntersectionObserverMock.instances[0]
    act(() => {
      io?.trigger([{ target, isIntersecting: true } as unknown as IntersectionObserverEntry])
    })
    callback.mockClear()

    // Scroll is dispatched on the container, not window.
    act(() => {
      container.dispatchEvent(new Event('scroll'))
    })
    await act(async () => {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve())
      })
    })

    expect(callback).toHaveBeenCalled()
  })

  it('invokes callback when custom container is resized (ResizeObserver)', async () => {
    // Proves: with a custom container, the hook uses ResizeObserver on that element; when it “resizes”, progress is recalculated.

    const container = document.createElement('div')
    const target = document.createElement('div')
    container.appendChild(target)
    document.body.appendChild(container)
    const ref = { current: target }
    const callback = vi.fn<(entry: UseScrollProgressEntry) => void>()

    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 100, 100))
    vi.spyOn(target, 'clientHeight', 'get').mockReturnValue(100)
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 100, 200))

    renderHook(() => useScrollProgress(ref, callback, { container }))

    // useResizeObserver(containerRef, …) creates one ResizeObserver; it’s in ResizeObserverMock.instances[0].
    await waitFor(() => {
      expect(ResizeObserverMock.instances.length).toBe(1)
    })
    const ro = ResizeObserverMock.instances[0]
    await waitFor(() => {
      expect(IntersectionObserverMock.instances.length).toBe(1)
    })
    const io = IntersectionObserverMock.instances[0]
    // Hook only runs scroll/resize updates when the target is in view; set that first.
    act(() => {
      io?.trigger([{ target, isIntersecting: true } as unknown as IntersectionObserverEntry])
    })
    callback.mockClear()

    // Simulate ResizeObserver firing: .trigger([entry]) runs the hook’s scheduleUpdate, which then calls our callback after RAF.
    act(() => {
      ro?.trigger([{ target: container } as unknown as ResizeObserverEntry])
    })
    await act(async () => {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve())
      })
    })

    expect(callback).toHaveBeenCalled()
  })

  it('does not observe or attach listeners when `when` is false', async () => {
    // Proves: when when: false, the hook does not set up IntersectionObserver, ResizeObserver, or scroll/resize listeners;
    // the callback is never invoked even if we fire scroll and resize.

    const target = document.createElement('div')
    document.body.appendChild(target)
    const ref = { current: target }
    const callback = vi.fn<(entry: UseScrollProgressEntry) => void>()

    renderHook(() => useScrollProgress(ref, callback, { when: false }))

    // No observer is created, so the mock’s .instances array stays empty.
    expect(IntersectionObserverMock.instances.length).toBe(0)

    act(() => {
      window.dispatchEvent(new Event('scroll'))
      window.dispatchEvent(new Event('resize'))
    })
    await act(async () => {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve())
      })
    })

    expect(callback).not.toHaveBeenCalled()
  })

  it('passes intersection observer options (root) when container is provided', async () => {
    // Proves: options (root, rootMargin, etc.) are passed through to the IntersectionObserver;
    // when container is set, root is that element.

    const container = document.createElement('div')
    const target = document.createElement('div')
    container.appendChild(target)
    document.body.appendChild(container)
    const ref = { current: target }
    const callback = vi.fn<(entry: UseScrollProgressEntry) => void>()

    renderHook(() => useScrollProgress(ref, callback, { container, rootMargin: '10px' }))

    await waitFor(() => {
      expect(IntersectionObserverMock.instances.length).toBe(1)
    })
    const io = IntersectionObserverMock.instances[0]
    // Our mock stores the constructor options so we can assert what the hook passed.
    expect(io?.options?.root).toBe(container)
    expect(io?.options?.rootMargin).toBe('10px')
  })
})
