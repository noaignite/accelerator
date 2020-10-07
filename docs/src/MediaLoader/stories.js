import * as React from 'react'
import Media from '@oakwood/oui/Media'
import MediaLoader from '@oakwood/oui/MediaLoader'

export default {
  title: 'Components/MediaLoader',
  component: MediaLoader,
}

const sources = {
  img: '//source.unsplash.com/1920x1080',
  picture: {
    xs: '//source.unsplash.com/600x340',
    sm: '//source.unsplash.com/960x545',
    md: '//source.unsplash.com/1280x726',
    lg: '//source.unsplash.com/1920x1080',
    xl: '//images3.alphacoders.com/975/975999.png',
  },
  video: '//www.w3schools.com/tags/movie.mp4',
}

const Template = ({ mediaProps, ...args }) => {
  const rootRef = React.useRef(null)
  const handleLoaded = React.useCallback(() => {
    rootRef.current.style.opacity = 1
  }, [])

  return (
    <MediaLoader
      onLoaded={handleLoaded}
      style={{
        display: 'grid',
        gridGap: 10,
        gridTemplateColumns: 'repeat(3, 1fr)',
        transition: 'opacity 750ms',
        opacity: 0,
      }}
      ref={rootRef}
      {...args}
    >
      <Media {...mediaProps} />
      <Media {...mediaProps} />
      <Media {...mediaProps} />
    </MediaLoader>
  )
}

export const Default = Template.bind({})
Default.args = {
  mediaProps: {
    component: 'img',
    src: sources.img,
    lazy: true,
  },
}

const Template2 = ({ mediaProps, ...args }) => (
  <MediaLoader {...args}>
    {({ loaded }) => (
      <Media style={{ transition: 'opacity 750ms', opacity: loaded ? 1 : 0 }} {...mediaProps} />
    )}
  </MediaLoader>
)

export const Img = Template2.bind({})
Img.args = {
  mediaProps: {
    component: 'img',
    src: sources.img,
  },
}

export const Picture = Template2.bind({})
Picture.args = {
  mediaProps: {
    component: 'picture',
    breakpoints: sources.picture,
  },
}

export const Video = Template2.bind({})
Video.args = {
  mediaProps: {
    component: 'video',
    poster: sources.img,
    src: sources.video,
    controls: true,
  },
}
