import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { useVisualViewport } from './useVisualViewport'

type ViewportState = {
  height: number
  offsetLeft: number
  offsetTop: number
  pageLeft: number
  pageTop: number
  scale: number
  width: number
}

class VisualViewportStub extends EventTarget {
  height = 0
  offsetLeft = 0
  offsetTop = 0
  pageLeft = 0
  pageTop = 0
  scale = 1
  width = 0
}

let visualViewportStub: VisualViewportStub

const viewportA: ViewportState = {
  height: 600,
  offsetLeft: 10,
  offsetTop: 20,
  pageLeft: 30,
  pageTop: 40,
  scale: 1.5,
  width: 800,
}

const viewportB: ViewportState = {
  height: 900,
  offsetLeft: 11,
  offsetTop: 21,
  pageLeft: 31,
  pageTop: 41,
  scale: 2,
  width: 1200,
}

const dispatch = (nextState: ViewportState) => {
  Object.assign(visualViewportStub, nextState)
  visualViewportStub.dispatchEvent(new Event('resize'))
}

describe('useVisualViewport', () => {
  beforeEach(() => {
    visualViewportStub = new VisualViewportStub()

    vi.stubGlobal('VisualViewport', VisualViewportStub)
    vi.stubGlobal('visualViewport', visualViewportStub)

    Object.defineProperty(window, 'visualViewport', {
      configurable: true,
      writable: true,
      value: visualViewportStub,
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('updates on visual viewport changes', async () => {
    const { result } = renderHook(() => useVisualViewport())

    act(dispatch.bind(null, viewportA))

    await waitFor(() => {
      expect(result.current.height).toBe(viewportA.height)
    })

    for (const [key, value] of Object.entries(viewportA)) {
      expect(result.current[key as keyof ViewportState]).toBe(value)
    }
  })

  test('when disabled, retains previous values and updates when re-enabled', async () => {
    const { result, rerender } = renderHook(({ when }) => useVisualViewport({ when }), {
      initialProps: { when: true },
    })

    act(dispatch.bind(null, viewportA))

    await waitFor(() => {
      expect(result.current.width).toBe(viewportA.width)
    })

    rerender({ when: false })

    act(dispatch.bind(null, viewportB))

    for (const [key, value] of Object.entries(viewportA)) {
      expect(result.current[key as keyof ViewportState]).toBe(value)
    }

    rerender({ when: true })

    await waitFor(() => {
      expect(result.current.height).toBe(viewportB.height)
    })

    for (const [key, value] of Object.entries(viewportB)) {
      expect(result.current[key as keyof ViewportState]).toBe(value)
    }
  })
})
