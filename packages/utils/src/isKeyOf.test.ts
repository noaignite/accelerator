import { describe, expect, expectTypeOf, it } from 'vitest'
import { isKeyOf } from './isKeyOf'

describe('isKeyOf', () => {
  it('returns true for own string keys', () => {
    expect(isKeyOf({ foo: 'bar' }, 'foo')).toEqual(true)
  })

  it('returns false for missing keys', () => {
    expect(isKeyOf({ foo: 'bar' }, 'bar')).toEqual(false)
  })

  it('returns false for inherited keys', () => {
    const obj = Object.create({ foo: 'bar' }) as { foo?: string }

    expect(isKeyOf(obj, 'foo')).toEqual(false)
  })

  it('returns true for own symbol keys', () => {
    const key = Symbol('key')

    expect(isKeyOf({ [key]: 'bar' }, key)).toEqual(true)
  })

  it('narrows computed keys for indexed access', () => {
    const reports = {
      reportDaily: { total: 1 },
      reportWeekly: { total: 7 },
    }

    const period = 'Daily' as 'Daily' | 'Weekly' | 'Monthly'
    const reportKey = `report${period}` as const

    if (isKeyOf(reports, reportKey)) {
      expectTypeOf(reportKey).toEqualTypeOf<keyof typeof reports>()
      expectTypeOf(reports[reportKey]).toEqualTypeOf<(typeof reports)[keyof typeof reports]>()
    }
    if (reportKey in reports) {
      // @ts-expect-error -- This verifies that using `in` operator does not type narrow.
      void reports[reportKey]
    }
  })
})
