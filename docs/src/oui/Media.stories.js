import * as React from 'react'
import { Media } from '@noaignite/oui'

const sources = {
  jpg: {
    xs: '//source.unsplash.com/DmD8HVOjy4c',
    sm: '//source.unsplash.com/Sl03gvNZuss',
    md: '//source.unsplash.com/m1m2EZOZVwA',
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
  title: 'Oui/Media',
  component: Media,
  argTypes: {
    component: {
      options: ['video', 'audio', 'picture', 'iframe', 'img'],
      control: {
        type: 'select',
      },
    },
    src: {
      options: [sources.jpg.xs, sources.mp3.xs, sources.mp4.xs],
      control: {
        type: 'select',
      },
    },
  },
}

const Template = (args) => <Media {...args} />

export const Img = Template.bind({})
Img.args = {
  component: 'img',
  src: sources.jpg.xs,
  alt: 'Image description',
  width: 960,
  height: 540,
}

export const Picture = Template.bind({})
Picture.args = {
  component: 'picture',
  breakpoints: sources.jpg,
  src: sources.jpg[sources.jpg.length - 1],
  alt: 'Image description',
  width: 960,
  height: 540,
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

export const CustomBreakpoints = Template.bind({})
CustomBreakpoints.args = {
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

const Template2 = (args) => (
  <React.Fragment>
    <div style={{ marginBottom: '150vh' }}>Scroll down to find image.</div>

    <Media width="16" height="9" {...args} />
  </React.Fragment>
)

export const ImgLazyLoading = Template2.bind({})
ImgLazyLoading.args = {
  src: sources.jpg.xs,
}

export const PictureLazyLoading = Template2.bind({})
PictureLazyLoading.args = {
  component: 'picture',
  breakpoints: { xs: sources.jpg.xs },
}

export const VideoLazyLoading = Template2.bind({})
VideoLazyLoading.args = {
  component: 'video',
  src: sources.mp4.xs,
}
