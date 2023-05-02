import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils'

export function getImageZoomUtilityClass(slot: string) {
  return generateUtilityClass('OuiImageZoom', slot)
}

const imageZoomClasses = generateUtilityClasses('OuiImageZoom', ['root', 'details'])

export default imageZoomClasses
