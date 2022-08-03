import * as React from 'react'
import { createRender, describeConformance, screen } from 'test/utils'
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

  it('should pass formit values & methods as onSubmit arguments', async () => {
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

    const { user } = render(
      <Form>
        <Field name="name" />
        <input type="submit" value="Submit" />
        <input type="reset" value="Reset" />
      </Form>,
      renderOptions,
    )
    const input = screen.getByRole('textbox')
    const [submitButton, resetButton] = screen.getAllByRole('button')

    await user.type(input, 'Jon Snow')
    await user.click(submitButton)
    expect(injectedValues.name).toBe('Jon Snow')

    await user.click(resetButton)
    await user.click(submitButton)
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
    expect('status' in injectedProps).toEqual(true)
    expect('errors' in injectedProps).toEqual(true)
    expect('values' in injectedProps).toEqual(true)
  })
})
