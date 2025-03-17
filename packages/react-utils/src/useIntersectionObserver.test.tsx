/* eslint-disable @typescript-eslint/no-explicit-any -- Allow for test files */
import { act, render, screen } from '@testing-library/react'
import { useRef } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { UseIntersectionObserverCallback } from './useIntersectionObserver'
import { useIntersectionObserver } from './useIntersectionObserver'

// We'll keep track of created observers so we can simulate intersection changes.
let observers: IntersectionObserverMock[] = []
let originalIntersectionObserver: typeof IntersectionObserver

// A mock IntersectionObserver implementation
class IntersectionObserverMock {
  public callback: IntersectionObserverCallback
  public options?: IntersectionObserverInit
  public isDisconnected = false

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback
    this.options = options
    observers.push(this)
  }

  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn().mockImplementation(() => {
    this.isDisconnected = true
  })

  // Manually trigger an intersection event, as if the browser observed a change.
  trigger(entries: IntersectionObserverEntry[]) {
    if (!this.isDisconnected) {
      this.callback(entries, this as unknown as IntersectionObserver)
    }
  }
}

// A simple component that uses the hook for testing.
function MockComponent({
  callback,
  when = true,
  once = false,
  root,
  rootMargin,
  threshold,
}: {
  callback: UseIntersectionObserverCallback
  when?: boolean
  once?: boolean
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
}) {
  const ref = useRef<HTMLDivElement>(null)
  useIntersectionObserver(ref, callback, { when, once, root, rootMargin, threshold })
  return <div data-testid="test-element" ref={ref} />
}

describe('useIntersectionObserver', () => {
  beforeEach(() => {
    // Replace the global IntersectionObserver with our mock before each test.
    originalIntersectionObserver = window.IntersectionObserver
    window.IntersectionObserver = IntersectionObserverMock as any
    observers = []
  })

  afterEach(() => {
    // Restore the original IntersectionObserver and clean up the DOM.
    window.IntersectionObserver = originalIntersectionObserver
  })

  it('should call the callback when an intersection is observed', () => {
    const onIntersect = vi.fn()
    render(<MockComponent callback={onIntersect} />)

    // Ensure our mock observer was created.
    expect(observers.length).toBe(1)
    const mockObserver = observers[0] as unknown as IntersectionObserverMock

    // A fake intersection entry to simulate the browser's intersection event.
    const element = screen.getByTestId('test-element')
    const fakeEntry = {
      target: element,
      isIntersecting: true,
      intersectionRatio: 1,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: 123,
    } as IntersectionObserverEntry

    // Trigger the intersection.
    mockObserver.trigger([fakeEntry])

    // The hook calls the callback with the single IntersectionObserverEntry.
    expect(onIntersect).toHaveBeenCalledWith(fakeEntry)
  })

  it('shold not create an observer when `when = false`', () => {
    const onIntersect = vi.fn()
    render(<MockComponent callback={onIntersect} when={false} />)

    // If `when = false`, we skip creating the observer.
    expect(observers.length).toBe(0)
  })

  it('should disconnect the observer on unmount', () => {
    const onIntersect = vi.fn()
    const { unmount } = render(<MockComponent callback={onIntersect} />)

    // Ensure our mock observer was created.
    expect(observers.length).toBe(1)
    const mockObserver = observers[0] as unknown as IntersectionObserverMock

    expect(mockObserver.disconnect).not.toHaveBeenCalled()

    // Unmount the component to trigger cleanup.
    unmount()

    // The observer should have been disconnected.
    expect(mockObserver.disconnect).toHaveBeenCalled()
  })

  it('should respect `once = true` by disconnecting after the first intersecting entry', () => {
    const onIntersect = vi.fn()
    render(<MockComponent callback={onIntersect} once />)

    // Ensure our mock observer was created.
    expect(observers.length).toBe(1)
    const mockObserver = observers[0] as unknown as IntersectionObserverMock

    // First intersection: isIntersecting = true.
    const fakeEntry = {
      isIntersecting: true,
    } as IntersectionObserverEntry

    // Trigger the intersection & wait for component lifecyles.
    act(() => {
      mockObserver.trigger([fakeEntry])
    })

    // The callback is called once...
    expect(onIntersect).toHaveBeenCalledTimes(1)
    // ...with that entry.
    expect(onIntersect).toHaveBeenCalledWith(fakeEntry)
    // The observer should disconnect after the first intersection.
    expect(mockObserver.disconnect).toHaveBeenCalled()

    // If we try to trigger again, nothing should happen because the observer is disconnected.
    mockObserver.trigger([fakeEntry])
    expect(onIntersect).toHaveBeenCalledTimes(1)
  })

  it('does not terminate if `once = true` but entry is not intersecting', () => {
    const onIntersect = vi.fn()
    render(<MockComponent callback={onIntersect} once />)

    // Ensure our mock observer was created.
    expect(observers.length).toBe(1)
    const mockObserver = observers[0] as unknown as IntersectionObserverMock

    const fakeEntry = {
      isIntersecting: false,
    } as IntersectionObserverEntry

    mockObserver.trigger([fakeEntry])
    // Because entry.isIntersecting = false, it should not terminate or disconnect.
    expect(onIntersect).toHaveBeenCalledWith(fakeEntry)
    expect(mockObserver.disconnect).not.toHaveBeenCalled()
  })
})
