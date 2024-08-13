import { describe, expect, it } from 'vitest'
import { capitalize } from './capitalize'

describe('capitalize', () => {
  it('should work', () => {
    expect(capitalize('foo baz')).to.equal('Foo baz')
  })
})
