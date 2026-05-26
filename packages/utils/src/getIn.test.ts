import { describe, expect, it } from 'vitest'
import { getIn } from './getIn'

describe('getIn', () => {
  const data = {
    user: {
      profile: {
        name: 'Ada',
      },
      settings: {
        title: undefined,
      },
    },
    items: [{ id: 1 }, { id: 2 }],
  }

  it('gets a nested value from an array path', () => {
    expect(getIn(data, ['user', 'profile', 'name'])).toBe('Ada')
  })

  it('gets a nested value from a dot path', () => {
    expect(getIn(data, 'items.1.id')).toBe(2)
  })

  it('returns undefined for missing paths', () => {
    expect(getIn(data, 'user.profile.age')).toBeUndefined()
  })

  it('returns the default value for missing paths', () => {
    expect(getIn(data, 'user.profile.age', 'unknown')).toBe('unknown')
  })

  it('does not use default value when property exists as undefined', () => {
    expect(getIn(data, 'user.settings.title', 'fallback')).toBeUndefined()
  })

  it('returns the source object on empty path', () => {
    expect(getIn(data, [])).toBe(data)
  })
})
