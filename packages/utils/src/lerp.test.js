import lerp from './lerp'

describe('lerp', () => {
  it('is a function and returns a number', () => {
    expect(typeof lerp).toEqual('function')
    expect(typeof lerp(1, 2, 3)).toEqual('number')
  })

  it('returns the correct result', () => {
    expect(lerp(0, 1, 0)).toEqual(0)
    expect(lerp(-25, 50, 1)).toEqual(50)
    expect(lerp(-25, 50, 0)).toEqual(-25)
    expect(lerp(100, 10, 0)).toEqual(100)
    expect(lerp(0, 100, 0.5)).toEqual(50)
  })
})
