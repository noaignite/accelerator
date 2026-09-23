import { useEffect, useLayoutEffect } from 'react'
import { describe, expect, test } from 'vitest'

describe('useIsomorphicEffect', () => {
  test('uses useLayoutEffect when window is defined', async () => {
    const { useIsomorphicEffect } = await import('@noaignite/react-utils')

    expect(useIsomorphicEffect).toBe(useLayoutEffect)
    expect(useIsomorphicEffect).not.toBe(useEffect)
  })
})
