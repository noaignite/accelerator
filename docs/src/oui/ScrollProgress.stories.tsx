import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ScrollProgress, ScrollEntry } from '@noaignite/oui'

const meta: Meta<typeof ScrollProgress> = {
  component: ScrollProgress,
}

export default meta
type Story = StoryObj<typeof ScrollProgress>

const Template: Story = {
  render: (args) => {
    const [state, setState] = React.useState<ScrollEntry | null>(null)

    return (
      <React.Fragment>
        <div style={{ position: 'fixed', padding: 20 }}>
          Progress: {state?.progress}
          <br />
          Inner Progress: {state?.innerProgress}
          <br />
        </div>

        <div style={{ height: '110vh' }} />
        <ScrollProgress onChange={setState} {...args} />
        <div style={{ height: '110vh' }} />
      </React.Fragment>
    )
  },
}

export const WithSmallElement = {
  ...Template,
  args: {
    style: { height: '10vh', background: 'hotpink' },
  },
}

export const WithLargeElement = {
  ...Template,
  args: {
    style: { height: '150vh', background: 'hotpink' },
  },
}
