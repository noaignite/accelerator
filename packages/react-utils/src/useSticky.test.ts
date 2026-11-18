import { useSticky } from '@noaignite/react-utils'
import { capitalize } from '@noaignite/utils'
import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { IntersectionObserverMock } from '../test'

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

const getObserver = async (element: HTMLElement, rootMargin: string, root?: HTMLElement) =>
  waitFor(() => {
    const observer = IntersectionObserverMock.instances.findLast(
      (instance) =>
        instance.options.rootMargin === rootMargin &&
        instance.options.root === root &&
        vi.mocked(instance.observe).mock.calls.some(([target]) => target === element),
    )
    if (!observer) throw new Error(`No observer found with rootMargin ${rootMargin}`)
    return observer
  })

const triggerIntersection = (
  observer: IntersectionObserverMock,
  element: HTMLElement,
  isIntersecting: boolean,
) => {
  act(() => {
    observer.trigger([
      {
        target: element,
        isIntersecting,
        boundingClientRect: new DOMRect(),
        intersectionRect: new DOMRect(),
        intersectionRatio: isIntersecting ? 1 : 0,
        rootBounds: null,
        time: 0,
      },
    ])
  })
}

describe('useSticky', () => {
  beforeAll(() => {
    global.IntersectionObserver = IntersectionObserverMock
  })

  afterEach(() => {
    IntersectionObserverMock.instances = []
    vi.restoreAllMocks()
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

    it('sets stuck true when first observer intersects and second does not', async () => {
      const element = createStickyElement({
        side,
        sideOffset,
        offsetDimension,
      })

      const ref = { current: element }
      const { result } = renderHook(() => useSticky(ref))

      const insetObserver = await getObserver(element, rootMargin)
      triggerIntersection(insetObserver, element, true)

      const boundaryObserver = await getObserver(element, `-${sideOffset + offsetDimension + 1}px`)
      triggerIntersection(boundaryObserver, element, false)

      await waitFor(() => {
        expect(result.current).toBe(true)
      })

      triggerIntersection(boundaryObserver, element, true)

      await waitFor(() => {
        expect(result.current).toBe(false)
      })
    })

    it('uses viewport bounds when body geometry would give the opposite result', async () => {
      const element = createStickyElement({ side, sideOffset, offsetDimension })
      const elementRect = element.getBoundingClientRect()
      const isVertical = side === 'top' || side === 'bottom'
      const sticksToStart = side === 'top' || side === 'left'
      const viewportDimension = isVertical ? window.innerHeight : window.innerWidth
      const bodyDimension = viewportDimension * 2
      const elementStart = isVertical ? elementRect.top : elementRect.left
      const elementEnd = isVertical ? elementRect.bottom : elementRect.right
      // Put the element nearer the body's opposite edge, but the viewport's sticky edge.
      const bodyStart = sticksToStart ? elementEnd - bodyDimension : elementStart
      const bodyRect = isVertical
        ? createRect({ y: bodyStart, width: window.innerWidth, height: bodyDimension })
        : createRect({ x: bodyStart, width: bodyDimension, height: window.innerHeight })
      const bodyGeometry = vi
        .spyOn(document.body, 'getBoundingClientRect')
        .mockReturnValue(bodyRect)
      const ref = { current: element }
      const { result } = renderHook(() => useSticky(ref))

      const insetObserver = await getObserver(element, rootMargin)
      triggerIntersection(insetObserver, element, true)
      const boundaryObserver = await getObserver(element, `-${sideOffset + offsetDimension + 1}px`)
      triggerIntersection(boundaryObserver, element, false)

      expect(result.current).toBe(true)
      expect(bodyGeometry).not.toHaveBeenCalled()
    })

    it.each([true, false])(
      'uses custom container bounds when stuck is %s',
      async (expectedStuck) => {
        const container = document.createElement('div')
        document.body.appendChild(container)

        const isVertical = side === 'top' || side === 'bottom'
        const sticksToStart = side === 'top' || side === 'left'
        const viewportDimension = isVertical ? window.innerHeight : window.innerWidth
        const containerStart = (viewportDimension * (sticksToStart ? 1 : 5)) / 8
        const containerDimension = viewportDimension / 4
        // In false cases, viewport geometry would incorrectly classify the element as stuck.
        const elementStart =
          sticksToStart === expectedStuck
            ? containerStart + sideOffset
            : containerStart + containerDimension - sideOffset - offsetDimension
        const element = createStickyElement({
          side,
          sideOffset,
          offsetDimension,
        })
        vi.mocked(element.getBoundingClientRect).mockReturnValue(
          isVertical
            ? createRect({ x: 12, y: elementStart, width: 100, height: offsetDimension })
            : createRect({ x: elementStart, y: 12, width: offsetDimension, height: 100 }),
        )

        container.appendChild(element)

        vi.spyOn(container, 'getBoundingClientRect').mockImplementation(() =>
          isVertical
            ? createRect({ y: containerStart, width: 300, height: containerDimension })
            : createRect({ x: containerStart, width: containerDimension, height: 300 }),
        )

        const ref = { current: element }
        const containerRef = { current: container }

        const { result } = renderHook(() => useSticky(ref, { container: containerRef }))

        const insetObserver = await getObserver(element, rootMargin, container)
        triggerIntersection(insetObserver, element, true)
        const boundaryObserver = await getObserver(
          element,
          `-${sideOffset + offsetDimension + 1}px`,
          container,
        )
        triggerIntersection(boundaryObserver, element, false)

        await waitFor(() => {
          expect(result.current).toBe(expectedStuck)
        })
      },
    )
  })

  it('ignores a pending observer callback after the element ref is cleared', async () => {
    const element = createStickyElement({ side: 'top', sideOffset: 10 })
    const ref: { current: HTMLElement | null } = { current: element }
    const { result } = renderHook(() => useSticky(ref))
    const insetObserver = await getObserver(element, '-30px')
    triggerIntersection(insetObserver, element, true)
    const boundaryObserver = await getObserver(element, '-31px')
    triggerIntersection(boundaryObserver, element, false)
    expect(result.current).toBe(true)

    vi.mocked(element.getBoundingClientRect).mockClear()
    ref.current = null

    expect(() => triggerIntersection(boundaryObserver, element, false)).not.toThrow()
    expect(result.current).toBe(true)
    expect(element.getBoundingClientRect).not.toHaveBeenCalled()
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
