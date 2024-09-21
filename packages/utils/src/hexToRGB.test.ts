import { describe, expect, it } from 'vitest'
import { hexToRGB } from './hexToRGB'

describe('hexToRGB', () => {
  it('should work', () => {
    expect(hexToRGB('FFFFFF')).toEqual([255, 255, 255])
    expect(hexToRGB('bcbcbc')).toEqual([188, 188, 188])
    expect(hexToRGB('000000')).toEqual([0, 0, 0])
  })
})
