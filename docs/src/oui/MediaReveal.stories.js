import * as React from 'react'
import Zoom from '@mui/material/Zoom'
import { Media, MediaReveal } from '@noaignite/oui'

export default {
  title: 'Oui/MediaReveal',
  component: MediaReveal,
}

const Template = ({ mediaProps, ...args }) => (
  <MediaReveal {...args}>
    <Media src="//source.unsplash.com/1920x1080" {...mediaProps} />
  </MediaReveal>
)

export const Default = Template.bind({})
Default.args = {}

export const WithVideo = Template.bind({})
WithVideo.args = {
  mediaProps: {
    component: 'video',
    src: '//www.w3schools.com/html/mov_bbb.mp4',
    autoPlay: true,
    controls: true,
    loop: true,
    muted: true,
    playsInline: true,
  },
}

export const CustomTransition = Template.bind({})
CustomTransition.args = {
  TransitionComponent: Zoom,
}

export const RootMargin = Template.bind({})
RootMargin.args = {
  rootMargin: '0% 0% -50%',
  style: { margin: '150vh 0' },
}
