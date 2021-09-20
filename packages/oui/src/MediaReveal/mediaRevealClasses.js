import { generateUtilityClass, generateUtilityClasses } from '@mui/core'

export function getAvatarUtilityClass(slot) {
  return generateUtilityClass('OuiMediaReveal', slot)
}

const mediaRevealClasses = generateUtilityClasses('OuiMediaReveal', ['root', 'bounds'])

export default mediaRevealClasses
