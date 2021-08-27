import * as React from 'react'
import AspectRatio from '@oakwood/oui/AspectRatio'

export default {
  title: 'Components/AspectRatio',
  component: AspectRatio,
}

const Template = (args) => (
  <AspectRatio {...args}>
    <img src="//source.unsplash.com/960x540" alt="" style={{ display: 'block', width: '100%' }} />
  </AspectRatio>
)

export const Default = Template.bind({})
Default.args = {
  width: 10,
  height: 5,
}
