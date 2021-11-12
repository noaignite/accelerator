import sleep from './sleep'

describe('sleep', () => {
  it('async await', async () => {
    const start = performance.now()
    await sleep(20)
    expect(performance.now() - start).toBeGreaterThanOrEqual(19)
  })

  it('then', async () => {
    const start = performance.now()
    sleep(20).then(() => {
      expect(performance.now() - start).toBeGreaterThanOrEqual(19)
    })
  })

  it('delayed sleep', async () => {
    const start = performance.now()

    const sleepPromise = sleep(20)

    await sleep(20)

    sleepPromise.then(() => {
      const end = performance.now()

      expect(end - start).toBeGreaterThanOrEqual(19)
      expect(end - start).toBeLessThan(30)
    })
  })
})
