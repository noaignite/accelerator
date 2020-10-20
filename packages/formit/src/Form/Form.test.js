import * as React from 'react'
import { createRender, describeConformance } from 'test/utils'
import Formit from '../Formit'
import Form from './Form'

describe('<Field />', () => {
  const render = createRender({ wrapper: Formit })

  const defaultProps = {
    children: <div />,
  }

  describeConformance(<Form {...defaultProps} />, () => ({
    inheritComponent: 'form',
    refInstanceof: window.HTMLFormElement,
    render,
    skip: ['componentProp', 'rootClass'],
  }))

  it('should pass formit context when using render props', () => {
    let injectedProps
    render(
      <Form>
        {(props) => {
          injectedProps = props
          return null
        }}
      </Form>,
    )

    expect(typeof injectedProps).toEqual('object')
  })
})
