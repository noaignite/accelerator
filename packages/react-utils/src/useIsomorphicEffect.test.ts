import { useEffect, useLayoutEffect } from 'react'
import { afterEach, describe, expect, test, vi } from 'vitest'

describe('useIsomorphicEffect', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('uses useLayoutEffect when window is defined', async () => {
    vi.resetModules()
    vi.stubGlobal('window', window)

    const { useIsomorphicEffect } = await import('./useIsomorphicEffect')

    expect(useIsomorphicEffect).toBe(useLayoutEffect)
    expect(useIsomorphicEffect).not.toBe(useEffect)
  })

  test('uses useEffect when window is not defined', async () => {
    vi.resetModules()
    vi.stubGlobal('window', undefined)

    const { useIsomorphicEffect } = await import('./useIsomorphicEffect')

    expect(useIsomorphicEffect).toBe(useEffect)
    expect(useIsomorphicEffect).not.toBe(useLayoutEffect)
  })
})
