import isFunction from './isFunction'

describe('isFunction', () => {
  it('is a function and returns if value is a function', () => {
    expect(typeof isFunction).toEqual('function')
    expect(typeof isFunction()).toEqual('boolean')
    expect(isFunction(isFunction)).toEqual(true)
    expect(isFunction()).toEqual(false)
  })
})
