import { generateUtilityClass, generateUtilityClasses } from '@mui/base'

export interface ImageZoomClasses {
  root: string
  details: string
}

export type ImageZoomClassKey = keyof ImageZoomClasses

export function getImageZoomUtilityClass(slot: string): string {
  return generateUtilityClass('OuiImageZoom', slot)
}

const imageZoomClasses: ImageZoomClasses = generateUtilityClasses('OuiImageZoom', [
  'root',
  'details',
])

export default imageZoomClasses
