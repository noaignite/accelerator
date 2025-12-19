import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { assert } from './assert'
import { sleep } from './sleep'

describe('sleep', () => {
  beforeEach(vi.useFakeTimers)

  afterEach(vi.useRealTimers)

  const getMockedSystemTime = () => {
    const systemTime = vi.getMockedSystemTime()?.getTime()
    assert(systemTime, 'The system time is not mocked')
    return systemTime
  }

  it('async await', async () => {
    const start = getMockedSystemTime()

    const promise = sleep(20)

    await vi.advanceTimersToNextTimerAsync()

    await expect(promise).resolves.toBeUndefined()
    expect(getMockedSystemTime() - start).toBeGreaterThanOrEqual(19)
  })

  it('then', async () => {
    const start = getMockedSystemTime()

    const promise = sleep(20).then(() => {
      expect(getMockedSystemTime() - start).toBeGreaterThanOrEqual(19)
    })

    await vi.advanceTimersToNextTimerAsync()

    await promise
  })

  it('delayed sleep', async () => {
    const start = getMockedSystemTime()

    const sleepPromise = sleep(20)

    const delaySleepPromise = sleep(30)

    await vi.runAllTimersAsync()

    await expect(delaySleepPromise).resolves.toBeUndefined()

    const promise = sleepPromise.then(() => {
      const end = getMockedSystemTime()

      expect(end - start).toBeGreaterThanOrEqual(30)
    })

    await vi.advanceTimersToNextTimerAsync()

    await promise
  })
})
