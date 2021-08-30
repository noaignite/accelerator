import { generateUtilityClass, generateUtilityClasses } from '@material-ui/unstyled'

export function getAvatarUtilityClass(slot) {
  return generateUtilityClass('OuiMediaReveal', slot)
}

const mediaRevealClasses = generateUtilityClasses('OuiMediaReveal', ['root', 'bounds'])

export default mediaRevealClasses
