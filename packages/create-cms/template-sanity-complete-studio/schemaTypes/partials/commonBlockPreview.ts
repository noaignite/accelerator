import { PreviewConfig } from 'sanity'
import { capitalize } from '../../utils'

const commonDocumentPreview: PreviewConfig = {
  select: {
    title: 'title',
    seoMedia: 'seo.image',
    highlightMedia: 'highlight.responsiveMedia.responsiveImage.mobile',
    lang: '_lang',
    type: '_type',
  },
  prepare: ({ lang, highlightMedia, seoMedia, title, type }) => ({
    title,
    subtitle: `${capitalize(type)} (${lang})`,
    media: highlightMedia || seoMedia,
  }),
}

export default commonDocumentPreview
