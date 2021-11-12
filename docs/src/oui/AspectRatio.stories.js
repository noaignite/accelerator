import * as React from 'react'
import { AspectRatio } from '@noaignite/oui'

export default {
  title: 'Oui/AspectRatio',
  component: AspectRatio,
}

const Template = (args) => (
  <AspectRatio {...args}>
    <img src="//source.unsplash.com/960x540" alt="" style={{ display: 'block', width: '100%' }} />
  </AspectRatio>
)

export const Ratio = Template.bind({})
Ratio.args = {
  ratio: 10 / 5,
}

export const WithAndHeight = Template.bind({})
WithAndHeight.args = {
  width: 10,
  height: 5,
}
