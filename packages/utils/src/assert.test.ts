import { describe, expect, it } from 'vitest'
import { assert } from './assert'

let foo: number | string | undefined
let bar: number | string | undefined

describe('assert', () => {
  it('should work', () => {
    foo = 1
    bar = '2'

    expect(() => assert(foo !== undefined, 'foo should not be undefined')).not.toThrowError()
    expect(() => assert(typeof bar !== 'string', 'bar should not be of type string')).toThrowError(
      /^bar should not be of type string$/,
    )
  })
})
