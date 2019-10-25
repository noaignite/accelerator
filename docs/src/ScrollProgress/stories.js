import React from 'react'
import { storiesOf } from '@storybook/react'
import ScrollProgress from '@oakwood/oui/ScrollProgress'

const stories = storiesOf('Components/ScrollProgress', module)

export const ScrollProgressStory = () => (
  <>
    <div style={{ height: '110vh' }} />

    <ScrollProgress
      // eslint-disable-next-line
      onChange={console.log}
      style={{ height: '10vh', background: 'hotpink' }}
    >
      scroll me
    </ScrollProgress>

    <div style={{ height: '110vh' }} />
  </>
)

export const ScrollProgressSectionStory = () => (
  <>
    <div style={{ height: '110vh' }} />

    <ScrollProgress
      // eslint-disable-next-line
      onChange={console.log}
      style={{ height: '150vh', background: 'hotpink' }}
    >
      scroll me
    </ScrollProgress>

    <div style={{ height: '110vh' }} />
  </>
)

stories.add('Default', ScrollProgressStory)
stories.add('With Section', ScrollProgressSectionStory)

export default ScrollProgress