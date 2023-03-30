import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Media, MediaLoader } from '@noaignite/oui'

const meta: Meta<typeof MediaLoader> = {
  component: MediaLoader,
}

export default meta
type Story = StoryObj<typeof MediaLoader>

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

export const WithCallback: Story = {
  args: {},
  render: (args) => {
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
        <Media component="picture" breakpoints={sources.picture} />
        <Media component="video" src={sources.video} poster={sources.img} controls />
      </MediaLoader>
    )
  },
}

export const WithRenderProps: Story = {
  args: {},
  render: (args) => (
    <MediaLoader {...args}>
      {({ loaded }) => (
        <div
          style={{
            display: 'grid',
            gridGap: 10,
            gridTemplateColumns: 'repeat(3, 1fr)',
            transition: 'opacity 750ms',
            opacity: loaded ? 1 : 0,
          }}
        >
          <Media src={sources.img} />
          <Media component="picture" breakpoints={sources.picture} />
          <Media component="video" src={sources.video} poster={sources.img} controls />
        </div>
      )}
    </MediaLoader>
  ),
}
