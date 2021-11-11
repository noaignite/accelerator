import clamp from './clamp'

describe('clamp', () => {
  it('is a function and returns a number', () => {
    expect(typeof clamp).toEqual('function')
    expect(typeof clamp(1, 2, 3)).toEqual('number')
  })

  it('returns the input in range min..max', () => {
    expect(clamp(0, 0, 9)).toEqual(0)
    expect(clamp(4, 0, 9)).toEqual(4)
    expect(clamp(9, 0, 9)).toEqual(9)
  })

  it('returns the minimum for values lesser than the minimum', () => {
    expect(clamp(1, 2, 3)).toEqual(2)
  })

  it('returns the maximum for values greater than the maximum', () => {
    expect(clamp(4, 2, 3)).toEqual(3)
  })

  it('works in negative ranges', () => {
    expect(clamp(-20, -20, -10)).toEqual(-20)
    expect(clamp(-10, -20, -10)).toEqual(-10)
    expect(clamp(-5, -20, -10)).toEqual(-10)
  })
})
