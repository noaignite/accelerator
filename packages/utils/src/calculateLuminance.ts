/**
 * Calculates the relative luminance of an RGB color.
 *
 * @param rgb - The RGB color.
 * @returns The color's relative luminance.
 */
export const calculateLuminance = (rgb: [number, number, number]): number => {
  const [r, g, b] = rgb.map((c) => {
    const sRGB = c / 255
    return sRGB <= 0.03928 ? sRGB / 12.92 : ((sRGB + 0.055) / 1.055) ** 2.4
  }) as [number, number, number]

  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luminance
}
