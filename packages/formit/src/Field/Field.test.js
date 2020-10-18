import * as React from 'react'
import { describeConformance, render } from 'test/utils'
import Formit from '../Formit'
import Field from './Field'

const noop = () => {}

const initialValues = {
  email: 'hello@world.com',
  password: 'foo123',
}

function renderFormit(ui, props) {
  let injectedProps

  const { rerender: rtlRerender, ...other } = render(
    <Formit initialValues={initialValues} onSubmit={noop} {...props}>
      {(formitProps) => {
        injectedProps = formitProps
        return ui || null
      }}
    </Formit>,
  )

  return {
    getFormitProps: () => injectedProps,
    rerender: () => {
      return rtlRerender(
        <Formit initialValues={initialValues} onSubmit={noop} {...props}>
          {(formitProps) => {
            injectedProps = formitProps
            return ui || null
          }}
        </Formit>,
      )
    },
    ...other,
  }
}

function renderField(props = {}, formProps) {
  let injectedProps

  if (!props.children && !props.component) {
    props.children = (fieldProps) => {
      injectedProps = fieldProps
      return <input name="email" data-testid="email" {...fieldProps} />
    }
  }

  return {
    getFieldProps: () => injectedProps,
    ...renderFormit(<Field name="email" data-testid="email" {...props} />, formProps),
  }
}

describe('<Field />', () => {
  describeConformance(<Field name="email" />, () => ({
    inheritComponent: 'input',
    refInstanceof: window.HTMLInputElement,
    render,
    testComponentPropWith: 'textarea',
    skip: ['rootClass'],
  }))

  it('should render with content of nested children when the `component` prop allows it', () => {
    const { container } = renderFormit(
      <Field component="select" name="name">
        <option value="Jared" label="foo1" />
        <option value="Brent" label="foo2" />
      </Field>,
    )

    expect(container.querySelectorAll('option')).toHaveLength(2)
  })

  it('should receive name, value & onChange props', () => {
    let injectedProps
    const Component = (props) => {
      injectedProps = props
      return 'input'
    }

    renderFormit(<Field name="email" component={Component} />)

    expect(typeof injectedProps.onChange).toEqual('function')
    expect(injectedProps.name).toBe('email')
    expect(injectedProps.value).toBe('hello@world.com')
    expect(injectedProps.error).toEqual(undefined)
    expect(injectedProps.helperText).toEqual(undefined)
  })

  it('should receive error & helperText props', () => {
    let injectedProps
    const Component = (props) => {
      injectedProps = props
      return 'input'
    }

    renderFormit(<Field name="email" component={Component} />, {
      initialErrors: { email: 'Must be a valid email address' },
    })

    expect(injectedProps.error).toEqual(true)
    expect(injectedProps.helperText).toEqual('Must be a valid email address')
  })

  it('can resolve mixed dot and bracket paths', () => {
    const { getFieldProps } = renderField(
      { name: "user['permissions'].1" },
      {
        initialValues: { user: { permissions: ['read', 'write'] } },
      },
    )

    expect(getFieldProps().value).toBe('write')
  })
})
