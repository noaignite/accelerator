import imageUrlBuilder from '@sanity/image-url'
import getSanityClient from './getSanityClient'

export default function buildImageUrl(sanityImage, settings = {}) {
  const sanityClient = getSanityClient()
  const builder = imageUrlBuilder(sanityClient)

  let image = builder.image(sanityImage).auto('format')

  Object.entries(settings).forEach(([key, value]) => {
    image = image[key](value)
  })

  return image.url()
}
