import * as React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { InView } from '@noaignite/oui'

export default {
  title: 'Oui/InView',
  component: InView,
  argTypes: {
    onEnter: { action: 'onEnter' },
    onExit: { action: 'onExit' },
  },
} as ComponentMeta<typeof InView>

const Template: ComponentStory<typeof InView> = (args) => (
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
