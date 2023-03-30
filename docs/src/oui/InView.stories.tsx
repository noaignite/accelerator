import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { InView } from '@noaignite/oui'

const meta: Meta<typeof InView> = {
  component: InView,
}

export default meta
type Story = StoryObj<typeof InView>

export const WithCallback: Story = {
  args: {},
  render: (args) => {
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
  },
}

export const WithRenderProps: Story = {
  args: {},
  render: (args) => (
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
  ),
}
