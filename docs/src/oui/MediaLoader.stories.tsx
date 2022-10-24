import * as React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Media, MediaLoader } from '@noaignite/oui'

export default {
  title: 'Oui/MediaLoader',
  component: MediaLoader,
} as ComponentMeta<typeof MediaLoader>

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

const Template: ComponentStory<typeof MediaLoader> = (args) => {
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const handleLoaded = React.useCallback(() => {
    if (rootRef.current) {
      rootRef.current.style.opacity = '1'
    }
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
      <Media src={sources.img} />
      <Media src={sources.img} />
      <Media src={sources.img} />
    </MediaLoader>
  )
}

export const Default = Template.bind({})
Default.args = {}

const Template2: ComponentStory<typeof MediaLoader> = (args) => (
  <MediaLoader {...args}>
    {({ loaded }) => (
      <Media src={sources.img} style={{ transition: 'opacity 750ms', opacity: loaded ? 1 : 0 }} />
    )}
  </MediaLoader>
)

export const Img = Template2.bind({})
Img.args = {}

const Template3: ComponentStory<typeof MediaLoader> = (args) => (
  <MediaLoader {...args}>
    {({ loaded }) => (
      <Media
        component="picture"
        breakpoints={sources.picture}
        style={{ transition: 'opacity 750ms', opacity: loaded ? 1 : 0 }}
      />
    )}
  </MediaLoader>
)

export const Picture = Template3.bind({})
Picture.args = {}

const Template4: ComponentStory<typeof MediaLoader> = (args) => (
  <MediaLoader {...args}>
    {({ loaded }) => (
      <Media
        component="video"
        poster={sources.img}
        src={sources.video}
        controls
        style={{ transition: 'opacity 750ms', opacity: loaded ? 1 : 0 }}
      />
    )}
  </MediaLoader>
)

export const Video = Template4.bind({})
Video.args = {}
