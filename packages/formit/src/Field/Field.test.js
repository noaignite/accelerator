import * as React from 'react'
import { Checkbox, FormControlLabel, Radio, TextField } from '@material-ui/core'
import userEvent from '@testing-library/user-event'
import { createRender, describeConformance } from 'test/utils'
import Formit from '../Formit'
import Field from './Field'

const noop = () => {}

const initialValues = {
  name: 'Jon',
  agree: false,
  fruits: ['Apple'],
  fruit: 'Apple',
}

const validationErrors = {
  name: 'Field is required',
}

const wrapperProps = {
  initialValues,
  validationErrors,
  onSubmit: noop,
}

describe('<Field />', () => {
  const render = createRender({ wrapper: Formit, wrapperProps })

  describeConformance(<Field name="name" />, () => ({
    inheritComponent: 'input',
    refInstanceof: window.HTMLInputElement,
    render,
    testComponentPropWith: 'textarea',
    skip: ['rootClass'],
  }))

  describe('should receive name, value, onChange & with/out helperText', () => {
    it('<Field />', () => {
      const { getByRole } = render(<Field name="name" required />)
      const input = getByRole('textbox')

      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('name', 'name')
      expect(input).toHaveValue(initialValues.name)

      userEvent.type(input, ' Snow')
      expect(input).toHaveValue(`${initialValues.name} Snow`)

      userEvent.clear(input)
    })

    it('<Field component={TextField} />', () => {
      const { getByRole, getByText } = render(<Field component={TextField} name="name" required />)
      const input = getByRole('textbox')

      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('name', 'name')
      expect(input).toHaveValue(initialValues.name)

      userEvent.type(input, ' Snow')
      expect(input).toHaveValue(`${initialValues.name} Snow`)

      userEvent.clear(input)
      expect(getByText(validationErrors.name)).toBeInTheDocument()
    })
  })

  describe('should render with content of nested children if `component` prop allows it', () => {
    it('<Field component="select" />', () => {
      const { getAllByRole, getByRole } = render(
        <Field component="select" name="name">
          <option value="Jon" label="Jon" />
          <option value="Ben" label="Ben" />
        </Field>,
      )

      expect(getByRole('combobox')).toBeInTheDocument()
      expect(getAllByRole('option')).toHaveLength(2)
    })

    it('<Field component={TextField} SelectProps={{ native: true }} select />', () => {
      const { getAllByRole, getByRole } = render(
        <Field component={TextField} SelectProps={{ native: true }} select name="name">
          <option value="Ben" label="Ben" />
          <option value="Jon" label="Jon" />
        </Field>,
      )

      expect(getByRole('combobox')).toBeInTheDocument()
      expect(getAllByRole('option')).toHaveLength(2)
    })
  })

  describe('should receive name, value, onChange', () => {
    it('<Field component={TextField} SelectProps={{ native: true }} select />', () => {
      const { getAllByRole, getByRole } = render(
        <Field component={TextField} SelectProps={{ native: true }} select name="name">
          <option value="Ben" label="Ben" />
          <option value="Jon" label="Jon" />
        </Field>,
      )
      const options = getAllByRole('option')

      expect(options[0].selected).toBe(false)
      expect(options[1].selected).toBe(true)

      userEvent.selectOptions(getByRole('combobox'), 'Ben')
      expect(options[0].selected).toBe(true)
      expect(options[1].selected).toBe(false)
    })

    it('<Field component={TextField} SelectProps={{ multiple: true, native: true }} select />', () => {
      const { getAllByRole, getByRole } = render(
        <Field
          component={TextField}
          SelectProps={{ multiple: true, native: true }}
          select
          name="fruits"
        >
          <option value="Banana" label="Banana" />
          <option value="Apple" label="Apple" />
        </Field>,
      )
      const options = getAllByRole('option')

      expect(options[0].selected).toBe(false)
      expect(options[1].selected).toBe(true)

      userEvent.selectOptions(getByRole('listbox'), 'Banana')
      expect(options[0].selected).toBe(true)
      expect(options[1].selected).toBe(true)
    })
  })

  describe('should render with `checked` when of type checkbox', () => {
    it('<Field type="checkbox" />', () => {
      const { getByRole } = render(<Field name="agree" type="checkbox" />)
      const input = getByRole('checkbox')

      expect(input).toBeInTheDocument()
      expect(input).not.toBeChecked()

      userEvent.click(input)
      expect(input).toBeChecked()
    })

    it('<Field component={FormControlLabel} control={<Checkbox />} />', () => {
      const { getByRole } = render(
        <Field component={FormControlLabel} control={<Checkbox />} name="agree" />,
      )
      const input = getByRole('checkbox')

      expect(input).toBeInTheDocument()
      expect(input).not.toBeChecked()

      userEvent.click(input)
      expect(input).toBeChecked()
    })
  })

  describe('should render with `checked` when of type radio', () => {
    it('<Field type="radio" />', () => {
      const { getAllByRole } = render(
        <>
          <Field name="fruit" value="Apple" type="radio" />
          <Field name="fruit" value="Banana" type="radio" />
        </>,
      )
      const inputs = getAllByRole('radio')

      expect(inputs).toHaveLength(2)
      expect(inputs[0]).toBeChecked()
      expect(inputs[1]).not.toBeChecked()

      userEvent.click(inputs[1])
      expect(inputs[0]).not.toBeChecked()
      expect(inputs[1]).toBeChecked()
    })

    it('<Field component={FormControlLabel} control={<Radio />} />', () => {
      const { getAllByRole } = render(
        <>
          <Field component={FormControlLabel} control={<Radio />} name="fruit" value="Apple" />,
          <Field component={FormControlLabel} control={<Radio />} name="fruit" value="Banana" />,
        </>,
      )
      const inputs = getAllByRole('radio')

      expect(inputs).toHaveLength(2)
      expect(inputs[0]).toBeChecked()
      expect(inputs[1]).not.toBeChecked()

      userEvent.click(inputs[1])
      expect(inputs[0]).not.toBeChecked()
      expect(inputs[1]).toBeChecked()
    })
  })

  describe('should handle multiple checkboxes when initial value is of type array', () => {
    it('<Field type="checkbox" />', () => {
      const { getAllByRole } = render(
        <>
          <Field name="fruits" value="Apple" type="checkbox" />
          <Field name="fruits" value="Banana" type="checkbox" />
        </>,
      )
      const inputs = getAllByRole('checkbox')

      expect(inputs).toHaveLength(2)
      expect(inputs[0]).toBeChecked()
      expect(inputs[1]).not.toBeChecked()

      userEvent.click(inputs[1])
      expect(inputs[0]).toBeChecked()
      expect(inputs[1]).toBeChecked()
    })

    it('<Field component={FormControlLabel} control={<Checkbox />} />', () => {
      const { getAllByRole } = render(
        <>
          <Field component={FormControlLabel} control={<Checkbox />} name="fruits" value="Apple" />
          <Field component={FormControlLabel} control={<Checkbox />} name="fruits" value="Banana" />
        </>,
      )
      const inputs = getAllByRole('checkbox')

      expect(inputs).toHaveLength(2)
      expect(inputs[0]).toBeChecked()
      expect(inputs[1]).not.toBeChecked()

      userEvent.click(inputs[1])
      expect(inputs[0]).toBeChecked()
      expect(inputs[1]).toBeChecked()
    })
  })

  it('should pass field props & meta when using render props', () => {
    let injectedProps
    render(
      <Field name="name">
        {(props) => {
          injectedProps = props
          return null
        }}
      </Field>,
      {
        wrapperProps: { ...wrapperProps, initialErrors: validationErrors },
      },
    )

    expect(injectedProps.field.name).toEqual('name')
    expect(injectedProps.field.value).toEqual(initialValues.name)
    expect(typeof injectedProps.field.onChange).toEqual('function')
    expect(injectedProps.meta.error).toEqual(true)
    expect(injectedProps.meta.helperText).toEqual(validationErrors.name)
  })

  it('should resolve mixed dot and bracket paths', () => {
    const { getByDisplayValue } = render(<Field name="user['permissions'].1" />, {
      wrapperProps: {
        initialValues: { user: { permissions: ['read', 'write'] } },
      },
    })

    expect(getByDisplayValue('write')).toBeInTheDocument()
  })
})
