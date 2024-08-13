import { describe, expect, it } from 'vitest'
import colorContrast from './colorContrast'

describe('colorContrast', () => {
  it('is a function and returns an object', () => {
    expect(typeof colorContrast).toEqual('function')
    expect(typeof colorContrast('#000')).toEqual('object')
    expect(typeof colorContrast('#000', '#fff')).toEqual('object')
  })

  it('handles invalid color arguments', () => {
    // @ts-expect-error -- This test case is for invalid arguments
    expect(colorContrast()).toEqual({})
    // @ts-expect-error -- This test case is for invalid arguments
    expect(colorContrast(0, 24, {})).toEqual({})
    // @ts-expect-error -- This test case is for invalid arguments
    expect(colorContrast(50, [], {})).toEqual({})
    // @ts-expect-error -- This test case is for invalid arguments
    expect(colorContrast().contrastRatio).toEqual(undefined)
  })

  it('accepts 3-digit hex colors, 6 digit hex colors; with or without #', () => {
    expect(colorContrast('#000', '#fff').contrastRatio).toEqual(21)
    expect(colorContrast('#000', 'fff').contrastRatio).toEqual(21)
    expect(colorContrast('000', '#fff').contrastRatio).toEqual(21)
    expect(colorContrast('000', 'fff').contrastRatio).toEqual(21)
    expect(colorContrast('#000000', '#ffffff').contrastRatio).toEqual(21)
    expect(colorContrast('#000000', 'ffffff').contrastRatio).toEqual(21)
    expect(colorContrast('000000', '#ffffff').contrastRatio).toEqual(21)
    expect(colorContrast('000000', 'ffffff').contrastRatio).toEqual(21)
  })

  it('accepts any number of color arguments', () => {
    expect(colorContrast('#000', '#fff', '#aaa').contrastRatio).toEqual(21)
    expect(colorContrast('#000', '#fff', '#aaa', '#bbb').contrastRatio).toEqual(21)
    expect(colorContrast('#000', '#fff', '#aaa', '#bbb', '#ccc').contrastRatio).toEqual(21)
  })

  it('returns the correct colorAA color', () => {
    expect(colorContrast('#000', '#aaa').colorAA).toEqual('#aaa')
    expect(colorContrast('#FFF', '#667789').colorAA).toEqual('#667789')
    expect(colorContrast('#FFF', '#74899F').colorAA).toEqual('#000')
  })

  it('returns the correct colorAAA color', () => {
    expect(colorContrast('#000', '#aaa').colorAAA).toEqual('#aaa')
    expect(colorContrast('#FFF', '#667789').colorAAA).toEqual('#000')
    expect(colorContrast('#FFF', '#74899F').colorAAA).toEqual('#000')
  })

  it('returns correct contrast ratio for arbitrary colors', () => {
    expect(colorContrast('#000', '#fff').contrastRatio).toEqual(21)
    expect(colorContrast('#000', '#aaa').contrastRatio).toEqual(9.04)
    expect(colorContrast('#FFF', '#667789').contrastRatio).toEqual(4.6)
    expect(colorContrast('#FFF', '#74899F').contrastRatio).toEqual(3.61)
    expect(colorContrast('#51f', '#821522', '#dde', 'f3a').contrastRatio).toEqual(5.38)
  })
})
