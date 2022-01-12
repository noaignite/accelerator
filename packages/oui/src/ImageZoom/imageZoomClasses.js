import { generateUtilityClass, generateUtilityClasses } from '@mui/base'

export function getImageZoomUtilityClass(slot) {
  return generateUtilityClass('OuiImageZoom', slot)
}

const imageZoomClasses = generateUtilityClasses('OuiImageZoom', ['root', 'details'])

export default imageZoomClasses
