import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Zoom from '@mui/material/Zoom'
import { Media, MediaReveal } from '@noaignite/oui'

const meta: Meta<typeof MediaReveal> = {
  component: MediaReveal,
}

export default meta
type Story = StoryObj<typeof MediaReveal>

const Template: Story = {
  render: (args) => (
    <MediaReveal {...args}>
      <Media src="//source.unsplash.com/1920x1080" />
    </MediaReveal>
  ),
}

export const Default = {
  ...Template,
  args: {},
}

export const WithCustomTransition = {
  ...Template,
  args: {
    TransitionComponent: Zoom,
  },
}

export const WithRootMargin = {
  ...Template,
  args: {
    rootMargin: '-50% 0%',
    style: { margin: '150vh 0' },
  },
}
