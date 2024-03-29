import * as React from 'react'
import { InView } from '@noaignite/oui'

export default {
  title: 'Oui/InView',
  component: InView,
}

const Template1 = (args) => {
  const [inView, setInView] = React.useState(false)

  const handleEnter = () => {
    setInView(true)
  }

  const handleExit = () => {
    setInView(false)
  }

  return (
    <InView onEnter={handleEnter} onExit={handleExit} style={{ margin: '200vh 0' }} {...args}>
      <img
        src="//placekitten.com/400/400"
        alt="A11y description"
        style={{ display: 'block', width: '100%' }}
      />

      <div style={{ position: 'fixed', top: 0, left: 0, padding: 16, background: '#eee' }}>
        {inView ? 'In view' : 'Not in view'}
      </div>
    </InView>
  )
}

export const PlainChildren = Template1.bind({})
PlainChildren.args = {
  rootMargin: '0px',
  triggerOnce: false,
}

const Template2 = (args) => (
  <InView style={{ margin: '200vh 0' }} {...args}>
    {({ inView }) => (
      <React.Fragment>
        <img
          src="//placekitten.com/400/400"
          alt="A11y description"
          style={{ display: 'block', width: '100%' }}
        />

        <div style={{ position: 'fixed', top: 0, left: 0, padding: 16, background: '#eee' }}>
          {inView ? 'In view' : 'Not in view'}
        </div>
      </React.Fragment>
    )}
  </InView>
)

export const RenderPropsChildren = Template2.bind({})
RenderPropsChildren.args = {
  rootMargin: '0px',
  triggerOnce: false,
}
