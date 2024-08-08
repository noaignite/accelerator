/**
 * Helper function to calculate relative luminance for a color
 */
const calculateLuminance = (rgb: [number, number, number]): number => {
  const [r, g, b] = rgb.map((c) => {
    const sRGB = c / 255
    return sRGB <= 0.03928 ? sRGB / 12.92 : ((sRGB + 0.055) / 1.055) ** 2.4
  }) as [number, number, number]

  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luminance
}

/**
 * Helper function to calculate contrast ratio between two colors
 */
const calculateContrast = (rgb1: [number, number, number], rgb2: [number, number, number]) => {
  const luminance1 = calculateLuminance(rgb1)
  const luminance2 = calculateLuminance(rgb2)
  const contrast =
    (Math.max(luminance1, luminance2) + 0.05) / (Math.min(luminance1, luminance2) + 0.05)
  return contrast
}

/**
 * Helper function to convert hex to RGB
 */
const hexToRGB = (hex: string): [number, number, number] => {
  let normalizedHex = hex.replace(/^#/, '')

  // Expand shorthand hex notation
  if (normalizedHex.length === 3) {
    normalizedHex = normalizedHex
      .split('')
      .map((char) => char + char)
      .join('')
  }

  const r = parseInt(normalizedHex.substring(0, 2), 16)
  const g = parseInt(normalizedHex.substring(2, 4), 16)
  const b = parseInt(normalizedHex.substring(4, 6), 16)
  return [r, g, b]
}

/**
 * Accepts a HEX `baseColor` and any number of HEX `colors`
 * and returns the color with the highest contrast ratio.
 *
 * @example
 * ```ts
 * colorContrast('#51f', '#821522', '#dde', 'f3a')
 * // { contrast: '#dde', contrastRatio: 5.38, colorAA: '#dde', colorAAA: '#fff' }
 * ```
 */
const colorContrast = (baseColor: string, ...restColors: string[]) => {
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

export default colorContrast
