import * as React from 'react'
import { storiesOf } from '@storybook/react'
import ScrollProgress from '@oakwood/oui/ScrollProgress'

const stories = storiesOf('Components/ScrollProgress', module)

stories.add('Default', () => {
  const [progress, setProgress] = React.useState(0)

  return (
    <>
      <div style={{ position: 'fixed', padding: 20 }}>Progress: {progress}</div>

      <div style={{ height: '110vh' }} />
      <ScrollProgress onChange={setProgress} style={{ height: '10vh', background: 'hotpink' }} />
      <div style={{ height: '110vh' }} />
    </>
  )
})

stories.add('With Section', () => {
  const [progress, setProgress] = React.useState(0)

  return (
    <>
      <div style={{ position: 'fixed', padding: 20 }}>Progress: {progress}</div>

      <div style={{ height: '110vh' }} />
      <ScrollProgress onChange={setProgress} style={{ height: '150vh', background: 'hotpink' }} />
      <div style={{ height: '110vh' }} />
    </>
  )
})
