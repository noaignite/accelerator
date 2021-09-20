import * as React from 'react'
import { createRender, describeConformance } from 'test/utils'
import Formit from './Formit'

describe('<Field />', () => {
  const render = createRender()

  const defaultProps = {
    children: <div />,
  }

  describeConformance(<Formit {...defaultProps} />, () => ({
    only: ['reactTestRenderer'],
  }))

  it('should pass formit context when using render props', () => {
    let injectedProps
    render(
      <Formit>
        {(props) => {
          injectedProps = props
          return null
        }}
      </Formit>,
    )

    expect(typeof injectedProps).toEqual('object')
  })
})
