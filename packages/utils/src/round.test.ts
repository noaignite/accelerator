import { describe, expect, it } from 'vitest'
import { round } from './round'

describe('round', () => {
  it('is a function and returns a number', () => {
    expect(typeof round).toEqual('function')
    expect(typeof round(1.23)).toEqual('number')
  })

  it('rounds to the nearest integer by default', () => {
    expect(round(4.006)).toEqual(4)
    expect(round(4.5)).toEqual(5)
    expect(round(-4.5)).toEqual(-4)
  })

  it('rounds to decimal places with positive precision', () => {
    expect(round(4.006, 2)).toEqual(4.01)
    expect(round(123.456, 1)).toEqual(123.5)
    expect(round(123.456, 2)).toEqual(123.46)
  })

  it('rounds to powers of ten with negative precision', () => {
    expect(round(4060, -2)).toEqual(4100)
    expect(round(1234, -1)).toEqual(1230)
    expect(round(1234, -3)).toEqual(1000)
  })

  it('handles common floating-point precision cases', () => {
    expect(round(1.005, 2)).toEqual(1.01)
    expect(round(10.235, 2)).toEqual(10.24)
  })
})
