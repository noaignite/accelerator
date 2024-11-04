import { describe, expect, it } from 'vitest'
import { URLSearchParamsFromObject } from './URLSearchParamsFromObject'

describe('URLSearchParamsFromObject', () => {
  it('is a function and returns a URLSearchParams instance', () => {
    expect(typeof URLSearchParamsFromObject).toEqual('function')
    expect(URLSearchParamsFromObject({}) instanceof URLSearchParams).toBe(true)
  })

  it('returns a URLSearchParams matching that of the `object` argument', () => {
    const object = { name: 'Alicia', hobbies: ['reading', 'dancing'] }
    const params = URLSearchParamsFromObject(object)

    expect(params.get('name')).toEqual(object.name)
    expect(params.getAll('hobbies')).toStrictEqual(object.hobbies)
    expect(Array.from(params.keys()).length).toBe(3)
    expect(new Set(params.keys()).size).toBe(2)
  })

  it('overrides params found in `initialSearchParams` argument if found in `object` argument', () => {
    const object = { hobbies: 'hiking' }
    const initialSearchParams = new URLSearchParams('name=Alicia&hobbies=reading&hobbies=dancing')
    const params = URLSearchParamsFromObject(object, initialSearchParams)

    expect(params.get('hobbies')).toEqual(object.hobbies)
  })

  it('preserves params found `initialSearchParams` argument if not found in `object` argument', () => {
    const object = { name: 'Alicia', hobbies: ['reading', 'dancing'] }
    const initialSearchParams = new URLSearchParams('age=30')
    const params = URLSearchParamsFromObject(object, initialSearchParams)

    expect(params.get('age')).toEqual('30')
  })
})
