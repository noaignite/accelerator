import * as React from 'react'
import { AspectRatio, MediaBase } from '@noaignite/oui'

export default {
  title: 'Oui/AspectRatio',
  component: AspectRatio,
}

const Template = (args) => (
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
  style: { '--aspect-ratio': 10 / 5 },
}
