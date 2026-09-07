import { capitalize } from '@noaignite/utils'
import { describe, expect, it } from 'vitest'

describe('capitalize', () => {
  it('should work', () => {
    expect(capitalize('foo baz')).to.equal('Foo baz')
  })
})
