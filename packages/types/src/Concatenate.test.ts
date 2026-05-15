import { describe, expectTypeOf, it } from 'vitest'
import type { Concatenate } from './Concatenate'

describe('Concatenate', () => {
  it('concatenates string and number tuples with an optional separator', () => {
    expectTypeOf<Concatenate<[]>>().toEqualTypeOf<''>()
    expectTypeOf<Concatenate<['hello', 'world']>>().toEqualTypeOf<'helloworld'>()
    expectTypeOf<Concatenate<['hello', 'world'], ' '>>().toEqualTypeOf<'hello world'>()
    expectTypeOf<
      Concatenate<['category', 'red-riding-hoodie'], '/'>
    >().toEqualTypeOf<'category/red-riding-hoodie'>()
    expectTypeOf<Concatenate<['item', 1, 'variant'], '-'>>().toEqualTypeOf<'item-1-variant'>()
    expectTypeOf<Concatenate<['prefix', ''], '-'>>().toEqualTypeOf<'prefix'>()
  })
})
