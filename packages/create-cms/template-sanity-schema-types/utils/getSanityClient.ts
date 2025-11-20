import { createClient } from '@sanity/client'

export const sanityClientConfig = {
  apiVersion: process.env.SANITY_STUDIO_API_VERSION,
  dataset: process.env.SANITY_STUDIO_DATASET,
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  useCdn: process.env.NODE_ENV === 'production',
}

export default function getSanityClient(config = {}) {
  return createClient({
    ...sanityClientConfig,
    ...config,
  })
}
