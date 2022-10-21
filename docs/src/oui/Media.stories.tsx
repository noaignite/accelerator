import * as React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Media } from '@noaignite/oui'

const sources = {
  jpg: {
    xs: '//source.unsplash.com/DmD8HVOjy4c',
    sm: '//source.unsplash.com/Sl03gvNZuss',
    md: '//source.unsplash.com/m1m2EZOZVwA',
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
} as ComponentMeta<typeof Media>

const Template: ComponentStory<typeof Media> = (args) => <Media {...args} />

export const Default = Template.bind({})
Default.args = {
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
  src: sources.jpg.md,
  alt: 'Image description',
  width: 960,
  height: 540,
}

export const PictureSizeAttributes = Template.bind({})
PictureSizeAttributes.args = {
  component: 'picture',
  breakpoints: {
    xs: { src: `${sources.jpg.xs}/960x540`, width: 960, height: 540 },
    md: { src: `${sources.jpg.sm}/540x960`, width: 540, height: 960 },
    xl: { src: `${sources.jpg.md}/960x960`, width: 960, height: 960 },
  },
  alt: 'Image description',
}

export const PictureMultiFormat = Template.bind({})
PictureMultiFormat.args = {
  component: 'picture',
  breakpoints: {
    xs: [{ src: sources.jpg.xs }, { src: sources.webp.xs, type: 'image/webp' }],
    sm: [{ src: sources.jpg.sm }, { src: sources.webp.sm, type: 'image/webp' }],
  },
  alt: 'Image description',
  width: 960,
  height: 540,
}

export const Audio = Template.bind({})
Audio.args = {
  component: 'audio',
  src: sources.mp3.xs,
  // autoPlay: true,
  // controls: true,
  // loop: true,
}

export const Video = Template.bind({})
Video.args = {
  component: 'video',
  src: sources.mp4.xs,
  // autoPlay: true,
  // controls: true,
  // loop: true,
  // muted: true,
  // playsInline: true,
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
      // autoPlay: true,
      // muted: true,
    },
  },
}

const Template2: ComponentStory<typeof Media> = (args) => (
  <React.Fragment>
    {Array.from(new Array(1000), (_, idx) => (
      <Media key={idx} src={sources.jpg.xs} style={{ height: 500 }} {...args} />
    ))}
  </React.Fragment>
)

export const DefaultLoadTest = Template2.bind({})
DefaultLoadTest.args = {}

export const NativeLazyLoadTest = Template2.bind({})
NativeLazyLoadTest.args = {
  loading: 'lazy',
  priority: true,
}

export const PriorityLoadTest = Template2.bind({})
PriorityLoadTest.args = {
  priority: true,
}
