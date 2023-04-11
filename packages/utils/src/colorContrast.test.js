import colorContrast from './colorContrast'

describe('colorContrast', () => {
  it('is a function and returns an object', () => {
    expect(typeof colorContrast).toEqual('function')
    expect(typeof colorContrast('#000', '#fff')).toEqual('object')
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

  it('returns the correct fallback color', () => {
    expect(colorContrast('#000', '#aaa').fallbackColor).toEqual('#FFFFFF')
    expect(colorContrast('#FFF', '#667789').fallbackColor).toEqual('#000000')
    expect(colorContrast('#FFF', '#74899F').fallbackColor).toEqual('#000000')
  })

  it('returns correct contrast ratio for arbitrary colors', () => {
    expect(colorContrast('#000', '#fff').contrastRatio).toEqual(21)
    expect(colorContrast('#000', '#aaa').contrastRatio).toEqual(9.04)
    expect(colorContrast('#FFF', '#667789').contrastRatio).toEqual(4.6)
    expect(colorContrast('#FFF', '#74899F').contrastRatio).toEqual(3.61)
    expect(colorContrast('#51f', '#821522', '#dde', 'f3a').contrastRatio).toEqual(5.38)
  })
})
