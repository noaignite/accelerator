import isStringInteger from './isStringInteger'

describe('isStringInteger', () => {
  it('is a function and returns if value is a number within a string', () => {
    expect(isStringInteger('1')).toEqual(true)
    expect(isStringInteger(1)).toEqual(false)
  })
})
