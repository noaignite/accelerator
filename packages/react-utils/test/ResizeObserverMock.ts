import { vi } from 'vitest'

/**
 * A simple ResizeObserver mock that captures instances
 * and exposes a .trigger() method to simulate resizes.
 */
export class ResizeObserverMock {
  private callback: ResizeObserverCallback
  private isDisconnected = false
  static instances: ResizeObserverMock[] = []

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback

    ResizeObserverMock.instances.push(this)
  }

  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn(() => {
    this.isDisconnected = true
  })
  trigger = (entries: ResizeObserverEntry[]) => {
    if (this.isDisconnected) return
    this.callback(entries, this)
  }
}
