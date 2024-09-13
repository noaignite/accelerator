import { calculateContrast } from './calculateContrast'
import { calculateLuminance } from './calculateLuminance'
import { hexToRGB } from './hexToRGB'

/**
 * Accepts a HEX `baseColor` and any number of HEX `colors` and returns the
 * color with the highest contrast ratio.
 *
 * @param baseColor - The base color to compare against.
 * @param restColors - Any number of colors to compare against the base color.
 * @returns An object containing the color with the highest contrast ratio.
 *
 * @example
 * ```ts
 * colorContrast('#51f', '#821522', '#dde', 'f3a')
 * // { contrast: '#dde', contrastRatio: 5.38, colorAA: '#dde', colorAAA: '#fff' }
 * ```
 */
export const colorContrast = (baseColor: string, ...restColors: string[]) => {
  if (!baseColor || typeof baseColor !== 'string') return {}

  const colors = restColors.filter((c) => typeof c === 'string')

  // Convert base color to RGB
  const baseRGB = hexToRGB(baseColor)

  // Find the color with the highest contrast ratio
  let highestContrastRatio = 0

  let bestContrastingColor = ''
  let absoluteContrast = ''

  for (const color of colors) {
    // Convert color to RGB
    const rgb = hexToRGB(color)

    // Calculate contrast ratio
    const contrast = calculateContrast(baseRGB, rgb)

    // Update highest contrast color
    if (contrast > highestContrastRatio) {
      highestContrastRatio = contrast
      bestContrastingColor = color
    }
  }

  // Determine the best fallbackColor, being black or white
  const luminance = calculateLuminance(baseRGB)
  absoluteContrast = luminance > 0.5 ? '#000' : '#fff'

  return {
    contrast: bestContrastingColor,
    contrastRatio: Math.round((highestContrastRatio + Number.EPSILON) * 100) / 100,
    colorAA: highestContrastRatio >= 4.5 ? bestContrastingColor : absoluteContrast,
    colorAAA: highestContrastRatio >= 7 ? bestContrastingColor : absoluteContrast,
  }
}
