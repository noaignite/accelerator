import { ComponentIcon } from '@sanity/icons'
import { PreviewConfig } from 'sanity'

function getBlockPreview(name: string): PreviewConfig {
  return {
    prepare: () => ({
      title: name,
      subtitle: 'Block',
      media: ComponentIcon,
    }),
  }
}

export default getBlockPreview
