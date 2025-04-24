/* eslint-disable @typescript-eslint/no-explicit-any -- Allow for test files */
import { vi } from 'vitest'

/**
 * A simple MediaQueryList mock that captures instances
 * and exposes a .trigger() method to simulate media changes.
 */
export class MediaQueryListMock {
  private listeners: ((event: MediaQueryListEvent) => void)[] = []
  public matches: boolean
  public media: string
  public onchange: ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null
  static instances: MediaQueryListMock[] = []

  constructor(media?: string, matches = false) {
    this.media = media ?? ''
    this.matches = matches
    this.onchange = null

    MediaQueryListMock.instances.push(this)
  }

  addEventListener = <K extends keyof MediaQueryListEventMap>(
    type: K,
    listener: (event: MediaQueryListEventMap[K]) => any,
  ) => {
    if (type === 'change') this.listeners.push(listener)
  }

  removeEventListener = <K extends keyof MediaQueryListEventMap>(
    type: K,
    listener: (event: MediaQueryListEventMap[K]) => any,
  ) => {
    if (type === 'change') this.listeners = this.listeners.filter((fn) => fn !== listener)
  }

  addListener = vi.fn((listener: (event: MediaQueryListEvent) => void) => {
    this.listeners.push(listener)
  })

  removeListener = vi.fn((listener: (event: MediaQueryListEvent) => void) => {
    this.listeners = this.listeners.filter((fn) => fn !== listener)
  })

  dispatchEvent = vi.fn((_event: Event) => true)

  trigger = () => {
    const event = { matches: this.matches } as MediaQueryListEvent
    this.listeners.forEach((callback) => callback(event))
  }
}
