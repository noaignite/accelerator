import { describe, expect, it } from 'vitest'
import { deepmerge } from './deepmerge'

describe('deepmerge', () => {
  // https://snyk.io/blog/after-three-years-of-silence-a-new-jquery-prototype-pollution-vulnerability-emerges-once-again/
  it('should not be subject to prototype pollution via __proto__', () => {
    const result = deepmerge(
      {},
      JSON.parse('{ "myProperty": "a", "__proto__" : { "isAdmin" : true } }'),
      {
        clone: false,
      },
    )

    // @ts-expect-error -- Allow `__proto__` for testing
    // eslint-disable-next-line no-proto -- Allow `__proto__` for testing
    expect(result.__proto__).toHaveProperty('isAdmin')
    expect({}).not.toHaveProperty('isAdmin')
  })

  // https://cwe.mitre.org/data/definitions/915.html
  it('should not be subject to prototype pollution via constructor', () => {
    const result = deepmerge(
      {},
      JSON.parse('{ "myProperty": "a", "constructor" : { "prototype": { "isAdmin" : true } } }'),
      {
        clone: true,
      },
    )

    expect(result.constructor.prototype).toHaveProperty('isAdmin')
    expect({}).not.toHaveProperty('isAdmin')
  })

  // https://cwe.mitre.org/data/definitions/915.html
  it('should not be subject to prototype pollution via prototype', () => {
    const result = deepmerge(
      {},
      JSON.parse('{ "myProperty": "a", "prototype": { "isAdmin" : true } }'),
      {
        clone: false,
      },
    )

    // @ts-expect-error -- Allow `__proto__` for testing
    expect(result.prototype).toHaveProperty('isAdmin')
    expect({}).not.toHaveProperty('isAdmin')
  })

  it('should appropriately copy the fields without prototype pollution', () => {
    const result = deepmerge(
      {},
      JSON.parse('{ "myProperty": "a", "__proto__" : { "isAdmin" : true } }'),
    )

    // @ts-expect-error -- Allow `__proto__` for testing
    // eslint-disable-next-line no-proto -- Allow `__proto__` for testing
    expect(result.__proto__).toHaveProperty('isAdmin')
    expect({}).not.toHaveProperty('isAdmin')
  })

  it('should merge keys that do not exist in source', () => {
    const result = deepmerge({ foo: { baz: 'test' } }, { foo: { bar: 'test' }, bar: 'test' })
    expect(result).toEqual({
      foo: { baz: 'test', bar: 'test' },
      bar: 'test',
    })
  })

  it('should deep clone source key object if target key does not exist', () => {
    const foo = { foo: { baz: 'test' } }
    const bar = {}

    const result = deepmerge(bar, foo)

    expect(result).toEqual({ foo: { baz: 'test' } })

    // @ts-expect-error -- Allow for easy testing
    result.foo.baz = 'new test'

    expect(result).toEqual({ foo: { baz: 'new test' } })
    expect(foo).toEqual({ foo: { baz: 'test' } })
  })
})
