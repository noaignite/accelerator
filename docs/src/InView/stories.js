import * as React from 'react'
import InView from '@oakwood/oui/InView'

export default {
  title: 'Components/InView',
  component: InView,
}

const TestComponent = React.forwardRef(function TestComponent(props, ref) {
  return (
    <img
      src="//placekitten.com/g/400/400"
      alt="A11y description"
      style={{ display: 'block', width: '100%' }}
      ref={ref}
      {...props}
    />
  )
})

const Template = (args) => <InView style={{ margin: '200vh 0' }} {...args} />

export const Default = Template.bind({})
Default.args = {
  component: TestComponent,
  rootMargin: '0% 0% -50%',
  triggerOnce: false,
  onEnter: (...args) => console.log('onEnter', ...args), // eslint-disable-line no-console
  onExit: (...args) => console.log('onExit', ...args), // eslint-disable-line no-console
  ref: (...args) => console.log('ref', ...args), // eslint-disable-line no-console
}
