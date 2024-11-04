import { describe, expect, it } from 'vitest'
import { isPlainObject } from './isPlainObject'
import { objectFromURLSearchParams } from './objectFromURLSearchParams'

describe('objectFromURLSearchParams', () => {
  it('is a function and returns a plain object', () => {
    const params = new URLSearchParams()
    expect(typeof objectFromURLSearchParams).toEqual('function')
    expect(isPlainObject(objectFromURLSearchParams(params))).toBe(true)
  })

  it('returns an object with key-value pairs matching that of passed `searchParams`', () => {
    const string = 'name=Alicia&hobbies=reading&hobbies=dancing&age='
    const params = new URLSearchParams(string)
    const object = objectFromURLSearchParams(params)
    const toMatch = { name: 'Alicia', hobbies: ['reading', 'dancing'], age: '' }

    expect(object).toStrictEqual(toMatch)
  })
})
