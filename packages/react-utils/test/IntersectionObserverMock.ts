import { vi } from 'vitest'

/**
 * A simple IntersectionObserver mock that captures instances
 * and exposes a .trigger() method to simulate intersections.
 */
export class IntersectionObserverMock {
  private callback: IntersectionObserverCallback
  private isDisconnected = false
  public options: IntersectionObserverInit
  public root: Element | Document | null
  public rootMargin: string
  public thresholds: number[]
  static instances: IntersectionObserverMock[] = []

  constructor(callback: IntersectionObserverCallback, options: IntersectionObserverInit = {}) {
    const { root, rootMargin, threshold } = options

    this.callback = callback
    this.options = options
    this.root = root ?? null
    this.rootMargin = rootMargin ?? ''
    this.thresholds = Array.isArray(threshold) ? threshold : [threshold ?? 0]

    IntersectionObserverMock.instances.push(this)
  }

  observe: IntersectionObserver['observe'] = vi.fn()
  unobserve: IntersectionObserver['unobserve'] = vi.fn()
  takeRecords: IntersectionObserver['takeRecords'] = vi.fn()
  disconnect: IntersectionObserver['disconnect'] = vi.fn(() => {
    this.isDisconnected = true
  })
  trigger = (entries: IntersectionObserverEntry[]) => {
    if (this.isDisconnected) return
    this.callback(entries, this)
  }
}
