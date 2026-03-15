import { describe, expect, it } from 'vitest'
import { traverse } from './traverse'

describe('traverse', () => {
  it('is a function and returns an iterable iterator', () => {
    const iterator = traverse({ children: [] }, 'children')

    expect(typeof traverse).toEqual('function')
    expect(typeof iterator[Symbol.iterator]).toEqual('function')
    expect(iterator[Symbol.iterator]()).toBe(iterator)
  })

  it('yields only the root object when there are no children', () => {
    const root = { id: 'root', children: [] as Array<{ id: string; children: unknown[] }> }

    expect([...traverse(root, 'children')]).toEqual([root])
  })

  it('traverses nested children in depth-first pre-order', () => {
    const tree = {
      id: 'root',
      children: [
        {
          id: 'a',
          children: [],
        },
        {
          id: 'b',
          children: [
            {
              id: 'c',
              children: [],
            },
          ],
        },
      ],
    }

    const ids = [...traverse(tree, 'children')].map((node) => node.id)

    expect(ids).toEqual(['root', 'a', 'b', 'c'])
  })

  it('yields only the current object when the keyed value is not an array', () => {
    const root = { id: 'root', children: null as unknown }

    expect([...traverse(root as { id: string; children: unknown[] }, 'children')]).toEqual([root])
  })
})
