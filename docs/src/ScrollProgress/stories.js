import React from 'react'
import { storiesOf } from '@storybook/react'
import ScrollProgress from '@oakwood/oui/ScrollProgress'

const stories = storiesOf('Components/ScrollProgress', module)

stories.add('Default', () => (
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
))

stories.add('With Section', () => (
  <>
    <div style={{ height: '110vh' }} />

    <ScrollProgress
      component="section"
      // eslint-disable-next-line
      onChange={console.log}
      style={{ height: '150vh', background: 'hotpink' }}
    >
      scroll me
    </ScrollProgress>

    <div style={{ height: '110vh' }} />
  </>
))
