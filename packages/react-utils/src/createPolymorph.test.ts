import type { HTMLElementType } from 'react'
import { createElement } from 'react'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

describe('createPolymorph', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  it('is a function', async () => {
    const { createPolymorph } = await import('./createPolymorph')
    expect(createPolymorph).toBeTypeOf('function')
  })

  it('returns passed reference-equal function', async () => {
    const { createPolymorph } = await import('./createPolymorph')

    const testFunction = (props: { as?: HTMLElementType }) => {
      return createElement(props.as ?? 'div')
    }
    expect(createPolymorph<object, HTMLElementType>(testFunction)).toEqual(testFunction)
  })

  it('throws if React version is below 19', async () => {
    vi.doMock('react', async () => {
      const actual = await vi.importActual('react')
      return { ...actual, version: '18.2.0' }
    })
    const { createPolymorph } = await import('./createPolymorph')

    expect(() => createPolymorph(() => null)).toThrowError(
      'To use `createPolymorph`, please upgrade "react" and "@types/react" to version 19 or higher.',
    )
  })
})
