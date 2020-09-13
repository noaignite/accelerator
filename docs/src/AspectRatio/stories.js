import * as React from 'react'
import Media from '@oakwood/oui/Media'
import AspectRatio from '@oakwood/oui/AspectRatio'

export default {
  title: 'Components/AspectRatio',
  component: AspectRatio,
}

const Template = (args) => (
  <AspectRatio {...args}>
    <Media component="img" src="//images3.alphacoders.com/975/975999.png" />
  </AspectRatio>
)

export const Default = Template.bind({})
Default.args = {
  width: 10,
  height: 5,
}
