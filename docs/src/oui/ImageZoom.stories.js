import * as React from 'react'
import { ImageZoom, Media } from '@noaignite/oui'

export default {
  title: 'Oui/ImageZoom',
  component: ImageZoom,
}

const Template1 = (args) => (
  <div style={{ minHeight: '150vh', padding: '10vh 10vw' }}>
    <ImageZoom {...args}>
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
  </div>
)

export const Default = Template1.bind({})
Default.args = {}

const Template2 = (args) => (
  <div style={{ minHeight: '150vh', padding: '10vh 10vw' }}>
    <ImageZoom {...args}>
      <Media src="//source.unsplash.com/DmD8HVOjy4c/400x500" />

      <Media src="//source.unsplash.com/DmD8HVOjy4c/1200x1500" />
    </ImageZoom>
  </div>
)

export const WithMedia = Template2.bind({})
WithMedia.args = {}
