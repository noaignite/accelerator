import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createBatchedCallback } from './createBatchedCallback'

describe('createBatchedCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('flushes queue after specified time', () => {
    const callback = vi.fn()
    const wait = 5000 // milliseconds

    let results = []
    const batchedCallback = createBatchedCallback({
      callback: (queue: string[]) => {
        callback(queue)
        results = queue
      },
      wait,
    })

    batchedCallback('foo')
    batchedCallback('bar')
    batchedCallback('baz')

    expect(results.length).toBe(0)

    vi.advanceTimersByTime(wait + 5)
    expect(callback).toHaveBeenCalledTimes(1)
    expect(results.length).toBe(3)
  })

  it('flushes queue when `limit` number is reached', () => {
    const callback = vi.fn()
    const wait = 5000

    let results = []
    const batchedCallback = createBatchedCallback({
      callback: (queue: string[]) => {
        callback(queue)
        results = queue
      },
      wait,
      limit: 4,
    })

    batchedCallback('foo')
    batchedCallback('bar')
    batchedCallback('qux')
    batchedCallback('quux')
    // Exceeding 4 entries, should therefore flush queue.
    batchedCallback('corge')

    expect(callback).toHaveBeenCalledTimes(1)
    expect(results.length).toBe(4)
  })

  it('flushes queue when `limit` function returns `true`', () => {
    const callback = vi.fn()
    const wait = 5000

    let results = []
    const batchedCallback = createBatchedCallback({
      callback: (queue: string[]) => {
        callback(queue)
        results = queue
      },
      wait,
      limit: (queue) => queue.length >= 4,
    })

    batchedCallback('foo')
    batchedCallback('bar')
    batchedCallback('qux')
    batchedCallback('quux')
    // Exceeding 4 entries, should therefore flush queue.
    batchedCallback('corge')

    expect(callback).toHaveBeenCalledTimes(1)
    expect(results.length).toBe(4)
  })
})
