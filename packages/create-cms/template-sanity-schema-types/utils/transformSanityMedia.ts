import transformSanityExternalVideo from './transformSanityExternalVideo'
import transformSanityImage from './transformSanityImage'
import transformSanityVideo from './transformSanityVideo'

export default function transformSanityMedia(sanityMedia) {
  if (!sanityMedia?.breakpoints?.xs) {
    return { component: 'picture', alt: '', breakpoints: { xs: '' } }
  }

  switch (sanityMedia.type) {
    case 'image':
      return transformSanityImage(sanityMedia)
    case 'video':
      return transformSanityVideo(sanityMedia)
    case 'externalVideo':
      return transformSanityExternalVideo(sanityMedia)
    default:
      throw new Error(`transformSanityMedia: type "${sanityMedia.type}" is invalid.`)
  }
}
