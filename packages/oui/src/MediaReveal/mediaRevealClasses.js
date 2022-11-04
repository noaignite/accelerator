import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils'

export function getMediaRevealUtilityClass(slot) {
  return generateUtilityClass('OuiMediaReveal', slot)
}

const mediaRevealClasses = generateUtilityClasses('OuiMediaReveal', ['root', 'bounds'])

export default mediaRevealClasses
