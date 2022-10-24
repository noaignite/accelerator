import * as React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ScrollProgress, ScrollEntry } from '@noaignite/oui'

export default {
  title: 'Oui/ScrollProgress',
  component: ScrollProgress,
} as ComponentMeta<typeof ScrollProgress>

const Template: ComponentStory<typeof ScrollProgress> = (args) => {
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
}

export const Default = Template.bind({})
Default.args = {
  style: { height: '10vh', background: 'hotpink' },
}

export const LargeElement = Template.bind({})
LargeElement.args = {
  style: { height: '150vh', background: 'hotpink' },
}
