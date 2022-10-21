import getObserverInstance from './getObserverInstance'

describe('getObserverInstance', () => {
  it('is a function and returns an object', () => {
    expect(typeof getObserverInstance).toEqual('function')
    expect(typeof getObserverInstance()).toEqual('object')
  })

  it('returns a singleton', () => {
    const observer1 = getObserverInstance()
    const observer2 = getObserverInstance()
    expect(observer1).toEqual(observer2)
  })
})
