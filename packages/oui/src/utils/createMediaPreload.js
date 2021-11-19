import * as React from 'react'

const SINGLE_SRC_MEDIA_COMPONENTS = ['img', 'video', 'audio', 'iframe']

export default function createMediaPreload(HeadComponent) {
  return function mediaPreload(props) {
    const { component, sources, src } = props

    const mediaType = component === 'img' ? 'image' : component

    return (
      <HeadComponent>
        {sources?.map((source) => (
          <link key={source.src} rel="preload" as="image" href={source.src} media={source.media} />
        ))}

        {src && SINGLE_SRC_MEDIA_COMPONENTS.includes(mediaType) && (
          <link key={src} rel="preload" as={mediaType} href={src} />
        )}
      </HeadComponent>
    )
  }
}
