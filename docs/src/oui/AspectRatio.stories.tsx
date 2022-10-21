import * as React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { AspectRatio, MediaBase } from '@noaignite/oui'

export default {
  title: 'Oui/AspectRatio',
  component: AspectRatio,
} as ComponentMeta<typeof AspectRatio>

const Template: ComponentStory<typeof AspectRatio> = (args) => (
  <AspectRatio {...args}>
    <MediaBase src="//source.unsplash.com/960x540" />
  </AspectRatio>
)

export const WithAndHeight = Template.bind({})
WithAndHeight.args = {
  width: 10,
  height: 5,
}

export const RatioAsNumber = Template.bind({})
RatioAsNumber.args = {
  ratio: 10 / 5,
}

export const RatioAsBoolean = Template.bind({})
RatioAsBoolean.args = {
  ratio: true,
  sx: { '--aspect-ratio': 10 / 5 },
}
