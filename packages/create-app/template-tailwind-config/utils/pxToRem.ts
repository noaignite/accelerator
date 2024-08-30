/**
 * Convert pixel value to rem value
 * @example pxToRem(16) // returns `1`, 16px is 1rem
 */
export function pxToRem(px: number, baseFontSize = 16) {
  return px / baseFontSize;
}
