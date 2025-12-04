export default function transformSanityVideo(sanityMedia) {
  return {
    component: 'video',
    ...sanityMedia,
  }
}
