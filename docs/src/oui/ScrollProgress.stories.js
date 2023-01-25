import * as React from 'react'
import { ScrollProgress } from '@noaignite/oui'

export default {
  title: 'Oui/ScrollProgress',
  component: ScrollProgress,
}

const Template = (args) => {
  const [state, setState] = React.useState({})
  const handleChange = React.useCallback(({ progress, innerProgress }) => {
    setState({ progress, innerProgress })
  }, [])

  return (
    <React.Fragment>
      <div style={{ position: 'fixed', padding: 20 }}>
        Progress: {state.progress}
        <br />
        Inner Progress: {state.innerProgress}
        <br />
      </div>

      <div style={{ height: '110vh' }} />
      <ScrollProgress onChange={handleChange} {...args} />
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
