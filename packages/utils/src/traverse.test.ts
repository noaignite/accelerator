import { describe, expect, it } from 'vitest'
import { traverse } from './traverse'

describe('traverse', () => {
  it('is a function and returns an array', () => {
    const results = traverse({ children: [] }, 'children')

    expect(typeof traverse).toEqual('function')
    expect(Array.isArray(results)).toEqual(true)
  })

  it('returns only the root object in array when there are no children', () => {
    const root = { id: 'root', children: [] as Array<{ id: string; children: unknown[] }> }

    expect(traverse(root, 'children')).toEqual([root])
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

  it('yields only the current object when the keyed value is not iterable', () => {
    const root = { id: 'root', children: null as unknown }

    expect(traverse(root, 'children')).toEqual([root])
  })

  it('traverses values that are iterable', () => {
    const secondChild = {
      id: 'baz',
      children: 'qux',
    }

    const firstChild = {
      id: 'bar',
      children: [secondChild],
    }

    const example = {
      id: 'foo',
      children: [firstChild],
    }

    const results = [...traverse(example, 'children')]

    expect(results).toEqual([example, firstChild, secondChild, 'q', 'u', 'x'])
  })
})
