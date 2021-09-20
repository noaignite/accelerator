import isObject from './isObject'

describe('isObject', () => {
  it('is a function and returns if value is a truthy object', () => {
    expect(isObject({})).toEqual(true)
    expect(isObject(null)).toEqual(false)
  })
})
