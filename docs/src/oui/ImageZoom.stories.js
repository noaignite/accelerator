import * as React from 'react'
import { ImageZoom, Media } from '@noaignite/oui'

export default {
  title: 'Oui/ImageZoom',
  component: ImageZoom,
}

const Template1 = (args) => (
  <ImageZoom style={{ margin: 100 }} {...args}>
    <img
      src="//source.unsplash.com/DmD8HVOjy4c/400x500"
      alt=""
      style={{ display: 'block', width: '100%' }}
    />

    <img
      src="//source.unsplash.com/DmD8HVOjy4c/1200x1500"
      alt=""
      style={{ display: 'block', width: '100%' }}
    />
  </ImageZoom>
)

export const Default = Template1.bind({})
Default.args = {}

const Template2 = (args) => (
  <ImageZoom style={{ margin: 100 }} {...args}>
    <Media src="//source.unsplash.com/DmD8HVOjy4c/400x500" />

    <Media src="//source.unsplash.com/DmD8HVOjy4c/1200x1500" />
  </ImageZoom>
)

export const WithMedia = Template2.bind({})
WithMedia.args = {}
