// @vitest-environment node

import { useEffect, useLayoutEffect } from 'react'
import { expect, test } from 'vitest'

test('uses useEffect when window is not defined', async () => {
  const { useIsomorphicEffect } = await import('@noaignite/react-utils')

  expect(useIsomorphicEffect).toBe(useEffect)
  expect(useIsomorphicEffect).not.toBe(useLayoutEffect)
})
