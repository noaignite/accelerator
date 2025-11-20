import { PreviewConfig } from 'sanity'
import { capitalize } from '../../utils'

const commonDocumentPreview: PreviewConfig = {
  select: {
    title: 'title',
    seoMedia: 'seo.image',
    highlightMedia: 'highlight.responsiveMedia.responsiveImage.mobile',
    lang: '_lang',
    type: '_type',
    url: 'slug.current',
  },
  prepare: ({ lang, highlightMedia, seoMedia, title, type, url }) => {
    const showUrl = url ? `/${lang}/${url}` : `(${lang})`
    return {
      title,
      subtitle: `${capitalize(type)} ${showUrl}`,
      media: highlightMedia || seoMedia,
    }
  },
}

export default commonDocumentPreview
