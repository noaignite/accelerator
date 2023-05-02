import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Media, MediaProps } from '@noaignite/oui'

const sources = {
  jpg: {
    xs: '//source.unsplash.com/DmD8HVOjy4c',
    sm: '//source.unsplash.com/Sl03gvNZuss',
    md: '//source.unsplash.com/m1m2EZOZVwA',
  },
  mp4: {
    xs: '//www.w3schools.com/html/mov_bbb.mp4',
    sm: '//www.w3schools.com/tags/movie.mp4',
  },
}

const meta: Meta<typeof Media> = {
  component: Media,
  argTypes: {
    component: {
      options: ['video', 'picture', 'img'],
      control: {
        type: 'select',
      },
    },
    src: {
      options: [sources.jpg.xs, sources.mp4.xs],
      control: {
        type: 'select',
      },
    },
  },
}

export default meta
// type Story = StoryObj<typeof Media>
type Story = StoryObj<MediaProps>

export const Img: Story = {
  args: {
    component: 'img',
    src: sources.jpg.xs,
    alt: 'Image description',
    width: 960,
    height: 540,
  },
}

export const Picture: Story = {
  args: {
    component: 'picture',
    breakpoints: sources.jpg,
    src: sources.jpg.md,
    alt: 'Image description',
    width: 960,
    height: 540,
  },
}

export const Video: Story = {
  args: {
    component: 'video',
    src: sources.mp4.xs,
    autoPlay: true,
    controls: true,
    loop: true,
    muted: true,
    playsInline: true,
  },
}

export const CustomBreakpoints: Story = {
  args: {
    breakpoints: {
      xs: {
        component: 'img',
        src: sources.jpg.xs,
        alt: 'Image description',
      },
      sm: {
        component: 'video',
        src: sources.mp4.xs,
        autoPlay: true,
        muted: true,
      },
    },
  },
}

const Template: Story = {
  render: (args) => (
    <React.Fragment>
      <div style={{ marginBottom: '150vh' }}>Scroll down to find image.</div>

      <Media width="16" height="9" {...args} />
    </React.Fragment>
  ),
}

export const ImgLazyLoading = {
  ...Template,
  args: {
    src: sources.jpg.xs,
  },
}

export const PictureLazyLoading = {
  ...Template,
  args: {
    component: 'picture',
    breakpoints: { xs: sources.jpg.xs },
  },
}

export const VideoLazyLoading = {
  ...Template,
  args: {
    component: 'video',
    src: sources.mp4.xs,
  },
}
