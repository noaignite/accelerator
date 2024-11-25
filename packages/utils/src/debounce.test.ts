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
    let actualContext: typeof expectedContext | undefined

    function collectContext(this: typeof expectedContext, ...args: unknown[]) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias -- Save context for tests outside this scope.
      actualContext = this
      handler(...args)
    }

    const timeout = 166
    const debounced = debounce(collectContext, timeout)
    debounced.apply(expectedContext, ['a', 'b'])
    expect(handler).not.toHaveBeenCalled()
    vi.advanceTimersByTime(timeout)
    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith('a', 'b')
    expect(actualContext).toBe(expectedContext)
  })

  it('should clear a pending task', () => {
    const handler = vi.fn()
    const timeout = 166
    const debounced = debounce(handler, timeout)

    debounced()
    expect(handler).not.toHaveBeenCalled()
    debounced.clear()
    vi.advanceTimersByTime(timeout)
    expect(handler).not.toHaveBeenCalled()
  })
})
