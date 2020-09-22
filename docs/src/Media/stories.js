import * as React from 'react'
import Media from '@oakwood/oui/Media'

const sources = {
  jpg: {
    xs: '//source.unsplash.com/960x540',
    sm: '//source.unsplash.com/1920x1080',
  },
  webp: {
    xs: '//www.gstatic.com/webp/gallery/1.sm.webp',
    sm: '//www.gstatic.com/webp/gallery/2.sm.webp',
  },
  mp3: {
    xs: '//www.w3schools.com/html/horse.mp3',
    sm: '//www.w3schools.com/html/horse.mp3',
  },
  mp4: {
    xs: '//www.w3schools.com/html/mov_bbb.mp4',
    sm: '//www.w3schools.com/tags/movie.mp4',
  },
}

export default {
  title: 'Components/Media',
  component: Media,
  argTypes: {
    component: {
      control: {
        type: 'select',
        options: ['video', 'audio', 'picture', 'iframe', 'img'],
      },
    },
    src: {
      control: {
        type: 'select',
        options: [sources.jpg.xs, sources.mp3.xs, sources.mp4.xs],
      },
    },
  },
}

const Template = (args) => <Media {...args} />

export const Default = Template.bind({})
Default.args = {
  component: 'img',
  src: sources.jpg.xs,
  alt: 'Image description',
}

export const Picture = Template.bind({})
Picture.args = {
  component: 'picture',
  breakpoints: sources.jpg,
  alt: 'Image description',
}

export const PictureMultiFormat = Template.bind({})
PictureMultiFormat.args = {
  component: 'picture',
  breakpoints: {
    xs: [{ src: sources.webp.xs, type: 'image/webp' }, { src: sources.jpg.xs }],
    sm: [{ src: sources.webp.sm, type: 'image/webp' }, { src: sources.jpg.sm }],
  },
  alt: 'Image description',
}

export const Audio = Template.bind({})
Audio.args = {
  component: 'audio',
  src: sources.mp3.xs,
  autoPlay: true,
  controls: true,
  loop: true,
}

export const Video = Template.bind({})
Video.args = {
  component: 'video',
  src: sources.mp4.xs,
  autoPlay: true,
  controls: true,
  loop: true,
  muted: true,
  playsInline: true,
}

export const Custom = Template.bind({})
Custom.args = {
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
}

export const Lazy = Template.bind({})
Lazy.args = {
  component: 'picture',
  breakpoints: sources.jpg,
  alt: 'Image description',
  loading: 'lazy',
  rootMargin: '0% 0% -50%',
  style: { margin: '200vh 0' },
}
