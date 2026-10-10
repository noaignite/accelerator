import { capitalize } from '@noaignite/utils'
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
  side,
  sideOffset,
  offsetDimension = 20,
}: {
  side: 'top' | 'left' | 'bottom' | 'right'
  sideOffset: number
  offsetDimension?: number
}) => {
  const element = document.createElement('div')
  element.style.position = 'sticky'
  element.style[side] = `${sideOffset}px`

  const [primaryDimension, secondaryDimension] = ['left', 'right'].includes(side)
    ? (['width', 'height'] as const)
    : (['height', 'width'] as const)

  const rectBySide: Record<typeof side, DOMRect> = {
    top: createRect({ x: 12, y: 2, width: 100, height: offsetDimension }),
    left: createRect({ x: 2, y: 12, width: offsetDimension, height: 100 }),
    bottom: createRect({
      x: 12,
      y: window.innerHeight - offsetDimension - 2,
      width: 100,
      height: offsetDimension,
    }),
    right: createRect({
      x: window.innerWidth - offsetDimension - 2,
      y: 12,
      width: offsetDimension,
      height: 100,
    }),
  }

  const rect = rectBySide[side]

  Object.defineProperty(element, `offset${capitalize(primaryDimension)}`, {
    configurable: true,
    value: offsetDimension,
  })

  Object.defineProperty(element, `offset${capitalize(secondaryDimension)}`, {
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

  describe.each(['top', 'left', 'bottom', 'right'] as const)('%s', (side) => {
    const sideOffset = 10
    const offsetDimension = 20
    const rootMargin = `-${sideOffset + offsetDimension}px`

    it('calculates observer rootMargin from sticky inset and element size', async () => {
      const element = createStickyElement({ side, sideOffset, offsetDimension })
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
      const element = createStickyElement({
        side,
        sideOffset,
        offsetDimension,
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

      const coordKey = ['left', 'right'].includes(side) ? 'x' : 'y'

      const sideOffset = 10
      const offsetDimension = 20
      const element = createStickyElement({
        side,
        sideOffset,
        offsetDimension,
      })

      const rootMargin = `-${sideOffset + offsetDimension}px`

      container.appendChild(element)

      vi.spyOn(container, 'getBoundingClientRect').mockImplementation(() =>
        createRect({ [coordKey]: 100, width: 300, height: 300 }),
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

    expect(() => renderHook(() => useSticky(ref))).toThrow()

    consoleErrorSpy.mockRestore()
  })
})
