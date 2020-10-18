import getIn from './getIn'

describe('getIn', () => {
  const obj = {
    a: {
      b: 2,
    },
  }

  it('gets a value by array path', () => {
    expect(getIn(obj, ['a', 'b'])).toBe(2)
  })

  it('gets a value by string path', () => {
    expect(getIn(obj, 'a.b')).toBe(2)
  })

  it('return "undefined" if value was not found using given path', () => {
    expect(getIn(obj, 'a.z')).toBeUndefined()
  })
})
