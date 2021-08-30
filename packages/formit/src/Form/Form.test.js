import * as React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRender, describeConformance } from 'test/utils'
import Formit from '../Formit'
import Field from '../Field'
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
    only: ['mergeClassName', 'propsSpread', 'refForwarding', 'reactTestRenderer'],
  }))

  it('should pass formit context when using render props', () => {
    let injectedValues
    let injectedMethods
    const renderOptions = {
      wrapperProps: {
        initialValues: { name: '' },
        onSubmit: (values, methods) => {
          injectedValues = values
          injectedMethods = methods
        },
      },
    }

    render(
      <Form>
        <Field name="name" />
        <input type="submit" value="Submit" />
        <input type="reset" value="Reset" />
      </Form>,
      renderOptions,
    )
    const input = screen.getByRole('textbox')
    const [submitButton, resetButton] = screen.getAllByRole('button')

    userEvent.type(input, 'Jon Snow')
    userEvent.click(submitButton)
    expect(injectedValues.name).toBe('Jon Snow')

    userEvent.click(resetButton)
    userEvent.click(submitButton)
    expect(injectedValues.name).toBe('')

    const testMethodKeys = [
      'resetForm',
      'setErrors',
      'setFieldError',
      'setFieldValue',
      'setStatus',
      'setSubmitting',
      'setValues',
    ]

    testMethodKeys.forEach((key) => {
      expect(key in injectedMethods).toBe(true)
    })
  })

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
