export default function transformSanityExternalVideo(sanityMedia) {
  return {
    component: 'video',
    ...sanityMedia,
  }
}
