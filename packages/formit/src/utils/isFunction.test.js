import isFunction from './isFunction'

describe('isFunction', () => {
  it('should return if value is a function', () => {
    expect(isFunction(isFunction)).toEqual(true)
    expect(isFunction('isFunction')).toEqual(false)
  })
})
