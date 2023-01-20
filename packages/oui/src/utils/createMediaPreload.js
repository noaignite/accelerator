import * as React from 'react'

const SINGLE_SRC_MEDIA_TYPES = ['audio', 'image', 'video']

export default function createMediaPreload(Wrapper = React.Fragment) {
  return function mediaPreload(options = {}) {
    const { component, sources, src } = options

    const mediaType = component === 'img' ? 'image' : component

    return (
      <Wrapper>
        {component === 'picture' &&
          sources?.map((source) => (
            <link
              key={source.src}
              rel="preload"
              as="image"
              href={source.src}
              media={source.media}
            />
          ))}

        {SINGLE_SRC_MEDIA_TYPES.includes(mediaType) && src && (
          <link key={src} rel="preload" as={mediaType} href={src} />
        )}
      </Wrapper>
    )
  }
}
