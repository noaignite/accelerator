import * as React from 'react'
import { screen } from '@testing-library/react'
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
  name: 'Field is required.',
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
    skip: ['componentsProp', 'rootClass'],
  }))

  describe('should receive name, value, onChange & with/out helperText', () => {
    it('<Field />', () => {
      render(<Field name="name" required />)
      const input = screen.getByRole('textbox')

      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('name', 'name')
      expect(input).toHaveValue(initialValues.name)

      userEvent.type(input, ' Snow')
      expect(input).toHaveValue(`${initialValues.name} Snow`)

      userEvent.clear(input)
    })

    it('<Field component={TextField} />', () => {
      render(<Field component={TextField} name="name" required />)
      const input = screen.getByRole('textbox')

      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('name', 'name')
      expect(input).toHaveValue(initialValues.name)

      userEvent.type(input, ' Snow')
      expect(input).toHaveValue(`${initialValues.name} Snow`)

      userEvent.clear(input)
      expect(screen.getByText(validationErrors.name)).toBeInTheDocument()
    })
  })

  describe('should render with content of nested children if `component` prop allows it', () => {
    it('<Field component="select" />', () => {
      render(
        <Field component="select" name="name">
          <option value="Jon" label="Jon" />
          <option value="Ben" label="Ben" />
        </Field>,
      )

      expect(screen.getByRole('combobox')).toBeInTheDocument()
      expect(screen.getAllByRole('option')).toHaveLength(2)
    })

    it('<Field component={TextField} SelectProps={{ native: true }} select />', () => {
      render(
        <Field component={TextField} SelectProps={{ native: true }} select name="name">
          <option value="Ben" label="Ben" />
          <option value="Jon" label="Jon" />
        </Field>,
      )

      expect(screen.getByRole('combobox')).toBeInTheDocument()
      expect(screen.getAllByRole('option')).toHaveLength(2)
    })
  })

  describe('should receive name, value, onChange', () => {
    it('<Field component={TextField} SelectProps={{ native: true }} select />', () => {
      render(
        <Field component={TextField} SelectProps={{ native: true }} select name="name">
          <option value="Ben" label="Ben" />
          <option value="Jon" label="Jon" />
        </Field>,
      )
      const options = screen.getAllByRole('option')

      expect(options[0].selected).toBe(false)
      expect(options[1].selected).toBe(true)

      userEvent.selectOptions(screen.getByRole('combobox'), 'Ben')
      expect(options[0].selected).toBe(true)
      expect(options[1].selected).toBe(false)
    })

    it('<Field component={TextField} SelectProps={{ multiple: true, native: true }} select />', () => {
      render(
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
      const options = screen.getAllByRole('option')

      expect(options[0].selected).toBe(false)
      expect(options[1].selected).toBe(true)

      userEvent.selectOptions(screen.getByRole('listbox'), 'Banana')
      expect(options[0].selected).toBe(true)
      expect(options[1].selected).toBe(true)
    })
  })

  describe('should render with `checked` when of type checkbox', () => {
    it('<Field type="checkbox" />', () => {
      render(<Field name="agree" type="checkbox" />)
      const input = screen.getByRole('checkbox')

      expect(input).toBeInTheDocument()
      expect(input).not.toBeChecked()

      userEvent.click(input)
      expect(input).toBeChecked()
    })

    it('<Field component={FormControlLabel} control={<Checkbox />} label="Label" />', () => {
      render(
        <Field component={FormControlLabel} control={<Checkbox />} label="Label" name="agree" />,
      )
      const input = screen.getByRole('checkbox')

      expect(input).toBeInTheDocument()
      expect(input).not.toBeChecked()

      userEvent.click(input)
      expect(input).toBeChecked()
    })
  })

  describe('should render with `checked` when of type radio', () => {
    it('<Field type="radio" />', () => {
      render(
        <>
          <Field name="fruit" value="Apple" type="radio" />
          <Field name="fruit" value="Banana" type="radio" />
        </>,
      )
      const inputs = screen.getAllByRole('radio')

      expect(inputs).toHaveLength(2)
      expect(inputs[0]).toBeChecked()
      expect(inputs[1]).not.toBeChecked()

      userEvent.click(inputs[1])
      expect(inputs[0]).not.toBeChecked()
      expect(inputs[1]).toBeChecked()
    })

    it('<Field component={FormControlLabel} control={<Radio />} label="Label" />', () => {
      render(
        <>
          <Field
            component={FormControlLabel}
            control={<Radio />}
            label="Label"
            name="fruit"
            value="Apple"
          />
          ,
          <Field
            component={FormControlLabel}
            control={<Radio />}
            label="Label"
            name="fruit"
            value="Banana"
          />
          ,
        </>,
      )
      const inputs = screen.getAllByRole('radio')

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
      render(
        <>
          <Field name="fruits" value="Apple" type="checkbox" />
          <Field name="fruits" value="Banana" type="checkbox" />
        </>,
      )
      const inputs = screen.getAllByRole('checkbox')

      expect(inputs).toHaveLength(2)
      expect(inputs[0]).toBeChecked()
      expect(inputs[1]).not.toBeChecked()

      userEvent.click(inputs[1])
      expect(inputs[0]).toBeChecked()
      expect(inputs[1]).toBeChecked()
    })

    it('<Field component={FormControlLabel} control={<Checkbox />} label="Label" />', () => {
      render(
        <>
          <Field
            component={FormControlLabel}
            control={<Checkbox />}
            label="Label"
            name="fruits"
            value="Apple"
          />
          <Field
            component={FormControlLabel}
            control={<Checkbox />}
            label="Label"
            name="fruits"
            value="Banana"
          />
        </>,
      )
      const inputs = screen.getAllByRole('checkbox')

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
          return <input type="text" {...injectedProps.field} required />
        }}
      </Field>,
    )
    const input = screen.getByRole('textbox')

    expect(input).toHaveAttribute('name', 'name')
    expect(input).toHaveValue(initialValues.name)
    expect(injectedProps.meta.error).toEqual(false)

    userEvent.clear(input)
    expect(injectedProps.meta.error).toEqual(true)
    expect(injectedProps.meta.helperText).toEqual(validationErrors.name)
  })

  it('should resolve mixed dot and bracket paths for field props & meta', () => {
    let injectedProps
    render(
      <Field name="user['permissions'].1">
        {(props) => {
          injectedProps = props
          return <input type="text" {...injectedProps.field} required />
        }}
      </Field>,
      {
        wrapperProps: {
          initialValues: { user: { permissions: ['read', 'write'] } },
          validationErrors: { user: { permissions: ['', 'Field is required.'] } },
        },
      },
    )
    const input = screen.getByRole('textbox')

    expect(input).toHaveAttribute('name', "user['permissions'].1")
    expect(input).toHaveValue('write')
    expect(injectedProps.meta.error).toEqual(false)

    userEvent.clear(input)
    expect(injectedProps.meta.error).toEqual(true)
    expect(injectedProps.meta.helperText).toEqual('Field is required.')
  })
})
