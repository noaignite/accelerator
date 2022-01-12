import { generateUtilityClass, generateUtilityClasses } from '@mui/base'

export function getMediaRevealUtilityClass(slot) {
  return generateUtilityClass('OuiMediaReveal', slot)
}

const mediaRevealClasses = generateUtilityClasses('OuiMediaReveal', ['root', 'bounds'])

export default mediaRevealClasses
