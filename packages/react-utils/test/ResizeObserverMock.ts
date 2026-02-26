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

  observe: ResizeObserver['observe'] = vi.fn()
  unobserve: ResizeObserver['unobserve'] = vi.fn()
  disconnect: ResizeObserver['disconnect'] = vi.fn(() => {
    this.isDisconnected = true
  })
  trigger = (entries: ResizeObserverEntry[]) => {
    if (this.isDisconnected) return
    this.callback(entries, this)
  }
}
