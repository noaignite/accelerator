import { describe, expect, it } from 'vitest'
import { sleep } from './sleep'

describe('sleep', () => {
  it('async await', async () => {
    const start = performance.now()
    await sleep(20)
    expect(performance.now() - start).toBeGreaterThanOrEqual(19)
  })

  it('then', async () => {
    const start = performance.now()
    return sleep(20).then(() => {
      expect(performance.now() - start).toBeGreaterThanOrEqual(19)
    })
  })

  it('delayed sleep', async () => {
    const start = performance.now()

    const sleepPromise = sleep(20)

    await sleep(30)

    return sleepPromise.then(() => {
      const end = performance.now()

      expect(end - start).toBeGreaterThanOrEqual(30)
    })
  })
})
