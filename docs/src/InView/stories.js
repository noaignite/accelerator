import * as React from 'react'
import InView from '@oakwood/oui/InView'

export default {
  title: 'Components/InView',
  component: InView,
  argTypes: {
    onEnter: { action: 'onEnter' },
    onExit: { action: 'onExit' },
  },
}

const Template = (args) => (
  <InView style={{ margin: '200vh 0' }} {...args}>
    <img
      src="//placekitten.com/400/400"
      alt="A11y description"
      style={{ display: 'block', width: '100%' }}
    />
  </InView>
)

export const Default = Template.bind({})
Default.args = {
  rootMargin: '0px',
  triggerOnce: false,
}
