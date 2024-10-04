/**
 * Helper function to convert hex to RGB
 */
export const hexToRGB = (hex: string): [number, number, number] => {
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
