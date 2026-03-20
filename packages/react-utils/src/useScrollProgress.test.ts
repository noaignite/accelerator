import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { IntersectionObserverMock, ResizeObserverMock } from '../test'
import { useScrollProgress } from './useScrollProgress'

type RectInit = {
  top: number
  left?: number
  width?: number
  height: number
}

const rafCallbacks = new Map<number, FrameRequestCallback>()
let rafId = 0

const getIntersectionEntry = (target: Element, isIntersecting: boolean) =>
  ({ target, isIntersecting }) as unknown as IntersectionObserverEntry

const getResizeEntry = (target: Element) => ({ target }) as unknown as ResizeObserverEntry

const flushAnimationFrame = (id?: number) => {
  const callbacks: Array<[number, FrameRequestCallback | undefined]> = id
    ? [[id, rafCallbacks.get(id)]]
    : Array.from(rafCallbacks.entries())

  act(() => {
    for (const [callbackId, callback] of callbacks) {
      if (!callback) continue
      rafCallbacks.delete(callbackId)
      callback(0)
    }
  })
}

const setElementRect = (element: Element, { top, left = 0, width = 100, height }: RectInit) => {
  const rect = new DOMRect(left, top, width, height)

  Object.defineProperty(element, 'clientHeight', {
    configurable: true,
    value: height,
  })

  Object.defineProperty(element, 'getBoundingClientRect', {
    configurable: true,
    value: () => rect,
  })
}

describe('useScrollProgress', () => {
  beforeAll(() => {
    global.IntersectionObserver = IntersectionObserverMock
    global.ResizeObserver = ResizeObserverMock
  })

  beforeEach(() => {
    rafCallbacks.clear()
    rafId = 0

    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        rafId += 1
        rafCallbacks.set(rafId, callback)
        return rafId
      }),
    )

    vi.stubGlobal(
      'cancelAnimationFrame',
      vi.fn((id: number) => {
        rafCallbacks.delete(id)
      }),
    )

    Object.defineProperty(document.documentElement, 'clientWidth', {
      configurable: true,
      value: 1024,
    })

    Object.defineProperty(document.documentElement, 'clientHeight', {
      configurable: true,
      value: 500,
    })
  })

  afterEach(() => {
    document.body.innerHTML = ''
    IntersectionObserverMock.instances = []
    ResizeObserverMock.instances = []
    rafCallbacks.clear()
    vi.clearAllMocks()
    vi.unstubAllGlobals()
  })

  it('reports initial viewport progress and updates on scroll while intersecting', async () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    setElementRect(div, { top: 200, height: 100 })

    const ref = { current: div }
    const callback = vi.fn()

    renderHook(() => useScrollProgress(ref, callback))

    await waitFor(() => {
      expect(callback).toHaveBeenCalledWith({
        innerProgress: 0.5,
        outerProgress: 0.5,
        target: div,
      })
    })

    const observer = IntersectionObserverMock.instances[0]
    act(() => {
      observer?.trigger([getIntersectionEntry(div, true)])
    })

    setElementRect(div, { top: 50, height: 100 })

    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })
    flushAnimationFrame()

    expect(callback).toHaveBeenLastCalledWith({
      innerProgress: 0.875,
      outerProgress: 0.75,
      target: div,
    })
  })

  it('uses the custom container for progress calculations and resize tracking', async () => {
    const container = document.createElement('div')
    const div = document.createElement('div')
    document.body.append(container, div)

    setElementRect(container, { top: 100, height: 300 })
    setElementRect(div, { top: 150, height: 100 })

    const ref = { current: div }
    const callback = vi.fn()

    renderHook(() => useScrollProgress(ref, callback, { container }))

    await waitFor(() => {
      expect(IntersectionObserverMock.instances.length).toBe(1)
      expect(ResizeObserverMock.instances.length).toBe(2)
    })

    expect(IntersectionObserverMock.instances[0]?.options.root).toBe(container)
    expect(callback).toHaveBeenCalledWith({
      innerProgress: 0.75,
      outerProgress: 0.625,
      target: div,
    })

    act(() => {
      IntersectionObserverMock.instances[0]?.trigger([getIntersectionEntry(div, true)])
    })

    setElementRect(div, { top: 100, height: 100 })
    act(() => {
      ResizeObserverMock.instances[0]?.trigger([getResizeEntry(container)])
    })
    flushAnimationFrame()

    expect(callback).toHaveBeenLastCalledWith({
      innerProgress: 1,
      outerProgress: 0.75,
      target: div,
    })
  })

  it('does not subscribe or call the callback when disabled', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    setElementRect(div, { top: 200, height: 100 })

    const ref = { current: div }
    const callback = vi.fn()

    renderHook(() => useScrollProgress(ref, callback, { when: false }))

    expect(callback).not.toHaveBeenCalled()
    expect(IntersectionObserverMock.instances.length).toBe(0)
    expect(ResizeObserverMock.instances.length).toBe(0)
  })

  it('uses the latest callback for scheduled updates', async () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    setElementRect(div, { top: 200, height: 100 })

    const ref = { current: div }
    const callback1 = vi.fn()
    const callback2 = vi.fn()

    const { rerender } = renderHook(({ callback }) => useScrollProgress(ref, callback), {
      initialProps: { callback: callback1 },
    })

    await waitFor(() => {
      expect(callback1).toHaveBeenCalledTimes(1)
      expect(IntersectionObserverMock.instances.length).toBe(1)
    })

    act(() => {
      IntersectionObserverMock.instances[0]?.trigger([getIntersectionEntry(div, true)])
    })

    rerender({ callback: callback2 })

    setElementRect(div, { top: 50, height: 100 })
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })
    flushAnimationFrame()

    expect(callback1).toHaveBeenCalledTimes(2)
    expect(callback2).toHaveBeenCalledTimes(1)
    expect(callback2).toHaveBeenCalledWith({
      innerProgress: 0.875,
      outerProgress: 0.75,
      target: div,
    })
  })

  it('cancels a pending animation frame on unmount', async () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    setElementRect(div, { top: 200, height: 100 })

    const ref = { current: div }
    const callback = vi.fn()

    const { unmount } = renderHook(() => useScrollProgress(ref, callback))

    await waitFor(() => {
      expect(IntersectionObserverMock.instances.length).toBe(1)
    })

    act(() => {
      IntersectionObserverMock.instances[0]?.trigger([getIntersectionEntry(div, true)])
      window.dispatchEvent(new Event('scroll'))
    })

    expect(requestAnimationFrame).toHaveBeenCalledTimes(1)

    unmount()

    expect(cancelAnimationFrame).toHaveBeenCalledWith(1)
  })
})
