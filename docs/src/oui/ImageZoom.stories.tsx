import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ImageZoom, Media } from '@noaignite/oui'

const meta: Meta<typeof ImageZoom> = {
  component: ImageZoom,
}

export default meta
type Story = StoryObj<typeof ImageZoom>

export const WithNativeImg: Story = {
  args: {},
  render: (args) => (
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
  ),
}

export const WithMedia: Story = {
  args: {},
  render: (args) => (
    <div style={{ minHeight: '150vh', padding: '10vh 10vw' }}>
      <ImageZoom {...args}>
        <Media src="//source.unsplash.com/DmD8HVOjy4c/400x500" />

        <Media src="//source.unsplash.com/DmD8HVOjy4c/1200x1500" />
      </ImageZoom>
    </div>
  ),
}
