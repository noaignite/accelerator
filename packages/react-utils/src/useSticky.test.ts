import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { IntersectionObserverMock } from '../test'
import { useSticky } from './useSticky'

const createRect = ({
  x = 0,
  y = 0,
  width = 100,
  height = 20,
}: {
  x?: number
  y?: number
  width?: number
  height?: number
}) => new DOMRect(x, y, width, height)

const createStickyElement = ({
  top = 10,
  offsetHeight = 20,
  rect = createRect({ y: 12, width: 100, height: 20 }),
}: {
  top?: number
  offsetHeight?: number
  rect?: DOMRect
} = {}) => {
  const element = document.createElement('div')
  element.style.position = 'sticky'
  element.style.top = `${top}px`

  Object.defineProperty(element, 'offsetHeight', {
    configurable: true,
    value: offsetHeight,
  })

  Object.defineProperty(element, 'offsetWidth', {
    configurable: true,
    value: 100,
  })

  vi.spyOn(element, 'getBoundingClientRect').mockImplementation(() => rect)
  document.body.appendChild(element)

  return element
}

describe('useSticky', () => {
  beforeAll(() => {
    global.IntersectionObserver = IntersectionObserverMock
  })

  afterEach(() => {
    IntersectionObserverMock.instances = []
    vi.clearAllMocks()
    document.body.innerHTML = ''
  })

  it('returns initialValue and does not observe when disabled', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)
    const ref = { current: element }

    const { result } = renderHook(() => useSticky(ref, { when: false, initialValue: true }))

    expect(result.current).toBe(true)
    expect(IntersectionObserverMock.instances.length).toBe(0)
  })

  it('calculates observer rootMargin from sticky inset and element size', async () => {
    const top = 10
    const offsetHeight = 20
    const rootMargin = `-${top + offsetHeight}px`
    const element = createStickyElement({ top, offsetHeight })
    const ref = { current: element }

    renderHook(() => useSticky(ref))

    await waitFor(() => {
      const observer = IntersectionObserverMock.instances.find(
        (instance) => instance.options.rootMargin === rootMargin,
      )
      expect(observer).toBeDefined()
    })
  })

  it('sets stuck true when first observer intersects and second does not', async () => {
    const top = 10
    const offsetHeight = 20
    const rootMargin = `-${top + offsetHeight}px`
    const element = createStickyElement({
      top,
      offsetHeight,
      rect: createRect({ y: 12, width: 100, height: 20 }),
    })

    const ref = { current: element }
    const { result } = renderHook(() => useSticky(ref))

    await waitFor(() => {
      expect(
        IntersectionObserverMock.instances.some(
          (instance) => instance.options.rootMargin === rootMargin,
        ),
      ).toBe(true)
    })

    const i1 = IntersectionObserverMock.instances.find(
      (instance) => instance.options.rootMargin === rootMargin,
    )

    expect(i1).toBeDefined()

    act(() => {
      i1?.trigger([
        { target: element, isIntersecting: true } as unknown as IntersectionObserverEntry,
      ])
    })

    await waitFor(() => {
      expect(IntersectionObserverMock.instances).not.toHaveLength(0)
    })

    const nonMountInstances = IntersectionObserverMock.instances.filter(
      (instance) => instance.options.rootMargin !== rootMargin,
    )

    expect(nonMountInstances).not.toHaveLength(0)

    act(() => {
      nonMountInstances.forEach((i) => {
        i.trigger([
          { target: element, isIntersecting: false } as unknown as IntersectionObserverEntry,
        ])
      })
    })

    await waitFor(() => {
      expect(result.current).toBe(true)
    })

    act(() => {
      nonMountInstances.forEach((i) => {
        i.trigger([
          { target: element, isIntersecting: true } as unknown as IntersectionObserverEntry,
        ])
      })
    })

    await waitFor(() => {
      expect(result.current).toBe(false)
    })
  })

  it('uses custom container as observer root and stickiness boundary', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const top = 10
    const offsetHeight = 20
    const element = createStickyElement({
      top,
      offsetHeight,
      rect: createRect({ y: 110, width: 100, height: 20 }),
    })

    const rootMargin = `-${top + offsetHeight}px`

    container.appendChild(element)

    vi.spyOn(container, 'getBoundingClientRect').mockImplementation(() =>
      createRect({ y: 100, width: 300, height: 300 }),
    )

    const ref = { current: element }
    const containerRef = { current: container }

    const { result } = renderHook(() => useSticky(ref, { container: containerRef }))

    await waitFor(() => {
      expect(
        IntersectionObserverMock.instances.some(
          (instance) =>
            instance.options.root === container && instance.options.rootMargin === rootMargin,
        ),
      ).toBe(true)
    })

    const i1 = IntersectionObserverMock.instances.find(
      (instance) =>
        instance.options.root === container && instance.options.rootMargin === rootMargin,
    )

    expect(i1).toBeDefined()

    act(() => {
      i1?.trigger([
        { target: element, isIntersecting: true } as unknown as IntersectionObserverEntry,
      ])
    })

    await waitFor(() => {
      expect(IntersectionObserverMock.instances.length).not.toBe(0)
    })

    const nonMountInstances = IntersectionObserverMock.instances.filter(
      (instance) =>
        instance.options.root === container &&
        instance !== i1 &&
        instance.options.rootMargin !== rootMargin,
    )

    expect(nonMountInstances).not.toHaveLength(0)

    act(() => {
      nonMountInstances.forEach((i) => {
        i.trigger([
          { target: element, isIntersecting: false } as unknown as IntersectionObserverEntry,
        ])
      })
    })

    await waitFor(() => {
      expect(result.current).toBe(true)
    })
  })

  it('throws when referenced element is not position: sticky', () => {
    const element = document.createElement('div')
    element.style.position = 'relative'
    element.style.top = '10px'
    document.body.appendChild(element)
    const ref = { current: element }

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
      void 0
    })

    expect(() => renderHook(() => useSticky(ref))).toThrowError()

    consoleErrorSpy.mockRestore()
  })
})
