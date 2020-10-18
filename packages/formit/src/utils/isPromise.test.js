import isPromise from './isPromise'

describe('isPromise', () => {
  it('is a function and returns if value is a promise', () => {
    expect(typeof isPromise).toEqual('function')
    expect(typeof isPromise()).toEqual('boolean')
    expect(isPromise(new Promise(() => {}))).toEqual(true)
    expect(isPromise({})).toEqual(false)
  })
})
