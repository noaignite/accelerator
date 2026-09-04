import { calculateLuminance } from './calculateLuminance'
/**
 * Calculates the contrast ratio between two RGB colors.
 *
 * @param rgb1 - The first RGB color.
 * @param rgb2 - The second RGB color.
 * @returns The contrast ratio between the colors.
 */
export const calculateContrast = (
  rgb1: [number, number, number],
  rgb2: [number, number, number],
) => {
  const luminance1 = calculateLuminance(rgb1)
  const luminance2 = calculateLuminance(rgb2)
  const contrast =
    (Math.max(luminance1, luminance2) + 0.05) / (Math.min(luminance1, luminance2) + 0.05)
  return contrast
}
