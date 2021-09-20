import isPromise from './isPromise'

describe('isPromise', () => {
  it('is a function and returns if value is a promise', () => {
    expect(isPromise(new Promise(() => {}))).toEqual(true)
    expect(isPromise({})).toEqual(false)
  })
})
