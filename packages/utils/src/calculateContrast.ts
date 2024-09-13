import { calculateLuminance } from './calculateLuminance'
/**
 * Helper function to calculate contrast ratio between two colors
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
