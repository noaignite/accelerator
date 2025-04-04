/* eslint-disable @typescript-eslint/no-explicit-any -- Allow for test files */
import { render, screen } from '@testing-library/react'
import { useRef } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useResizeObserver, type UseResizeObserverCallback } from './useResizeObserver'

// We'll store any observer instances created so we can trigger their callbacks.
let observers: ResizeObserverMock[] = []
let originalResizeObserver: typeof ResizeObserver

// A mock ResizeObserver implementation
class ResizeObserverMock {
  callback: ResizeObserverCallback
  disconnect: () => void

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
    // Create a spy for disconnect so we can verify it's called on unmount.
    this.disconnect = vi.fn()
    observers.push(this)
  }
  observe(_target: Element) {
    // no-op for testing
  }
  unobserve(_target: Element) {
    // no-op for testing
  }
}

// A simple mock component that uses the hook.
function MockComponent({
  onResize,
  when = true,
}: {
  onResize: UseResizeObserverCallback
  when?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  useResizeObserver(ref, onResize, { when })
  return <div data-testid="resize-element" ref={ref} />
}

describe('useResizeObserver', () => {
  beforeEach(() => {
    // Reset our observers array and override the global ResizeObserver.
    observers = []
    originalResizeObserver = window.ResizeObserver
    window.ResizeObserver = ResizeObserverMock as any
  })

  afterEach(() => {
    // Restore the original ResizeObserver and clean up the DOM.
    window.ResizeObserver = originalResizeObserver
  })

  it('should call the callback when a resize is observed', () => {
    const callback = vi.fn()
    render(<MockComponent onResize={callback} />)
    const element = screen.getByTestId('resize-element')

    // Ensure our mock observer was created.
    expect(observers.length).toBe(1)
    const mockObserver = observers[0] as unknown as ResizeObserverMock

    // Create a fake ResizeObserverEntry.
    const fakeEntry = {
      target: element,
      contentRect: { width: 100, height: 200, top: 0, left: 0, bottom: 200, right: 100 },
    } as unknown as ResizeObserverEntry

    // Simulate the resize event.
    mockObserver.callback([fakeEntry], mockObserver)
    expect(callback).toHaveBeenCalledWith(fakeEntry)
  })

  it('should not register the observer when "when" is false', () => {
    const callback = vi.fn()
    render(<MockComponent onResize={callback} when={false} />)

    // No observer should have been created.
    expect(observers.length).toBe(0)
  })

  it('should disconnect the observer on unmount', () => {
    const callback = vi.fn()
    const { unmount } = render(<MockComponent onResize={callback} />)

    // Ensure our mock observer was created.
    expect(observers.length).toBe(1)
    const mockObserver = observers[0] as unknown as ResizeObserverMock

    // Unmount the component to trigger cleanup.
    unmount()
    expect(mockObserver.disconnect).toHaveBeenCalled()
  })
})
