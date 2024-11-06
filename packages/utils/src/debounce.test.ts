import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { debounce } from './debounce'

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  it('should debounce', () => {
    const handler = vi.fn()
    const expectedContext = { foo: 'bar' }
    let actualContext

    function collectContext(...args: unknown[]) {
      // @ts-expect-error -- Ignore usage of `this`.
      actualContext = this
      handler(...args)
    }

    const debounced = debounce(collectContext)
    debounced.apply(expectedContext, ['a', 'b'])
    expect(handler).not.toHaveBeenCalled()
    vi.advanceTimersByTime(166)
    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith('a', 'b')
    expect(actualContext).toBe(expectedContext)
  })

  it('should clear a pending task', () => {
    const handler = vi.fn()
    const debounced = debounce(handler)

    debounced()
    expect(handler).not.toHaveBeenCalled()
    debounced.clear()
    vi.advanceTimersByTime(166)
    expect(handler).not.toHaveBeenCalled()
  })
})
