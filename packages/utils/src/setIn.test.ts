import { describe, expect, it } from 'vitest'
import { setIn } from './setIn'

describe('setIn', () => {
  it('sets a nested value without mutating the original object', () => {
    const input = {
      user: {
        profile: {
          name: 'Ada',
        },
      },
      stable: {
        keep: true,
      },
    }

    const result = setIn(input, ['user', 'profile', 'name'], 'Grace')

    expect(result).toEqual({
      user: {
        profile: {
          name: 'Grace',
        },
      },
      stable: {
        keep: true,
      },
    })
    expect(input.user.profile.name).toBe('Ada')
    expect(result).not.toBe(input)
    expect(result.user).not.toBe(input.user)
    expect(result.stable).toBe(input.stable)
  })

  it('creates missing objects on the path', () => {
    const result = setIn({}, 'user.profile.name', 'Ada')

    expect(result).toEqual({
      user: {
        profile: {
          name: 'Ada',
        },
      },
    })
  })

  it('creates arrays when the next path key is numeric', () => {
    const result = setIn({}, 'items.0.name', 'Notebook')

    expect(result).toEqual({
      items: [
        {
          name: 'Notebook',
        },
      ],
    })
  })

  it('supports setting in existing arrays', () => {
    const input = {
      items: [{ id: 1 }, { id: 2 }],
    }

    const result = setIn(input, 'items.1.id', 42)

    expect(result).toEqual({
      items: [{ id: 1 }, { id: 42 }],
    })
    expect(input.items[1]?.id).toBe(2)
  })

  it('replaces the root value on empty path', () => {
    const result = setIn({ a: 1 }, [], { b: 2 })

    expect(result).toEqual({ b: 2 })
  })
})
