import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { MediaQueryListMock } from '../test'
import { useMediaQuery } from './useMediaQuery'

describe('useMediaQuery', () => {
  const media = '(max-width: 600px)'
  let sharedMql: MediaQueryListMock

  beforeAll(() => {
    // Always return the same MediaQueryListMock instance to allow for
    // mutation of values in tests.
    sharedMql = new MediaQueryListMock(media, false)

    window.matchMedia = (_query: string) => sharedMql
    global.MediaQueryList = MediaQueryListMock
  })

  afterEach(() => {
    MediaQueryListMock.instances = []
    vi.clearAllMocks()
  })

  it('returns initialValue when `when` is false', () => {
    const { result } = renderHook(() => useMediaQuery(media, { initialValue: true, when: false }))
    expect(result.current).toBe(true)
  })

  it('updates to actual matchMedia.matches on mount', async () => {
    // SharedMql.matches is false initially
    const { result } = renderHook(() => useMediaQuery(media))

    // Wait for effect to read sharedMql.matches
    await waitFor(() => expect(result.current).toBe(false))
  })

  it('responds to change events', async () => {
    const { result } = renderHook(() => useMediaQuery(media, { initialValue: false }))

    // Ensure mount has set initial value
    await waitFor(() => expect(result.current).toBe(false))

    // Flip sharedMql.matches and trigger
    act(() => {
      sharedMql.matches = true
      sharedMql.trigger()
    })

    await waitFor(() => expect(result.current).toBe(true))
  })
})
