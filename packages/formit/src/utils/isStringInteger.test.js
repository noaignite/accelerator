import isStringInteger from './isStringInteger'

describe('isStringInteger', () => {
  it('is a function and returns if value is a number within a string', () => {
    expect(typeof isStringInteger).toEqual('function')
    expect(typeof isStringInteger()).toEqual('boolean')
    expect(isStringInteger('1')).toEqual(true)
    expect(isStringInteger(1)).toEqual(false)
  })
})
