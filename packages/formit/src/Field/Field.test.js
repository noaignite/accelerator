import * as React from 'react'
import { Checkbox, FormControlLabel, Radio, TextField } from '@mui/material'
import { createRender, describeConformance, screen } from 'test/utils'
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
    only: ['componentProp', 'mergeClassName', 'propsSpread', 'refForwarding', 'reactTestRenderer'],
  }))

  describe('should receive name, value, onChange & with/out helperText', () => {
    it('<Field />', async () => {
      const { user } = render(<Field name="name" required />)
      const input = screen.getByRole('textbox')

      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('name', 'name')
      expect(input).toHaveValue(initialValues.name)

      await user.type(input, ' Snow')
      expect(input).toHaveValue(`${initialValues.name} Snow`)

      await user.clear(input)
    })

    it('<Field component={TextField} />', async () => {
      const { user } = render(<Field component={TextField} name="name" required />)
      const input = screen.getByRole('textbox')

      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('name', 'name')
      expect(input).toHaveValue(initialValues.name)

      await user.type(input, ' Snow')
      expect(input).toHaveValue(`${initialValues.name} Snow`)

      await user.clear(input)
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
    it('<Field component={TextField} SelectProps={{ native: true }} select />', async () => {
      const { user } = render(
        <Field component={TextField} SelectProps={{ native: true }} select name="name">
          <option value="Ben" label="Ben" />
          <option value="Jon" label="Jon" />
        </Field>,
      )
      const options = screen.getAllByRole('option')

      expect(options[0].selected).toBe(false)
      expect(options[1].selected).toBe(true)

      await user.selectOptions(screen.getByRole('combobox'), 'Ben')
      expect(options[0].selected).toBe(true)
      expect(options[1].selected).toBe(false)
    })

    it('<Field component={TextField} SelectProps={{ multiple: true, native: true }} select />', async () => {
      const { user } = render(
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

      await user.selectOptions(screen.getByRole('listbox'), 'Banana')
      expect(options[0].selected).toBe(true)
      expect(options[1].selected).toBe(true)
    })
  })

  describe('should render with `checked` when of type checkbox', () => {
    it('<Field type="checkbox" />', async () => {
      const { user } = render(<Field name="agree" type="checkbox" />)
      const input = screen.getByRole('checkbox')

      expect(input).toBeInTheDocument()
      expect(input).not.toBeChecked()

      await user.click(input)
      expect(input).toBeChecked()
    })

    it('<Field component={FormControlLabel} control={<Checkbox />} label="Label" />', async () => {
      const { user } = render(
        <Field component={FormControlLabel} control={<Checkbox />} label="Label" name="agree" />,
      )
      const input = screen.getByRole('checkbox')

      expect(input).toBeInTheDocument()
      expect(input).not.toBeChecked()

      await user.click(input)
      expect(input).toBeChecked()
    })
  })

  describe('should render with `checked` when of type radio', () => {
    it('<Field type="radio" />', async () => {
      const { user } = render(
        <React.Fragment>
          <Field name="fruit" value="Apple" type="radio" />
          <Field name="fruit" value="Banana" type="radio" />
        </React.Fragment>,
      )
      const inputs = screen.getAllByRole('radio')

      expect(inputs).toHaveLength(2)
      expect(inputs[0]).toBeChecked()
      expect(inputs[1]).not.toBeChecked()

      await user.click(inputs[1])
      expect(inputs[0]).not.toBeChecked()
      expect(inputs[1]).toBeChecked()
    })

    it('<Field component={FormControlLabel} control={<Radio />} label="Label" />', async () => {
      const { user } = render(
        <React.Fragment>
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
        </React.Fragment>,
      )
      const inputs = screen.getAllByRole('radio')

      expect(inputs).toHaveLength(2)
      expect(inputs[0]).toBeChecked()
      expect(inputs[1]).not.toBeChecked()

      await user.click(inputs[1])
      expect(inputs[0]).not.toBeChecked()
      expect(inputs[1]).toBeChecked()
    })
  })

  describe('should handle multiple checkboxes when initial value is of type array', () => {
    it('<Field type="checkbox" />', async () => {
      const { user } = render(
        <React.Fragment>
          <Field name="fruits" value="Apple" type="checkbox" />
          <Field name="fruits" value="Banana" type="checkbox" />
        </React.Fragment>,
      )
      const inputs = screen.getAllByRole('checkbox')

      expect(inputs).toHaveLength(2)
      expect(inputs[0]).toBeChecked()
      expect(inputs[1]).not.toBeChecked()

      await user.click(inputs[1])
      expect(inputs[0]).toBeChecked()
      expect(inputs[1]).toBeChecked()
    })

    it('<Field component={FormControlLabel} control={<Checkbox />} label="Label" />', async () => {
      const { user } = render(
        <React.Fragment>
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
        </React.Fragment>,
      )
      const inputs = screen.getAllByRole('checkbox')

      expect(inputs).toHaveLength(2)
      expect(inputs[0]).toBeChecked()
      expect(inputs[1]).not.toBeChecked()

      await user.click(inputs[1])
      expect(inputs[0]).toBeChecked()
      expect(inputs[1]).toBeChecked()
    })
  })

  it('should pass field props & meta when using render props', async () => {
    let injectedProps
    const { user } = render(
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

    await user.clear(input)
    expect(injectedProps.meta.error).toEqual(true)
    expect(injectedProps.meta.helperText).toEqual(validationErrors.name)
  })

  it('should resolve mixed dot and bracket paths for field props & meta', async () => {
    let injectedProps
    const { user } = render(
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

    await user.clear(input)
    expect(injectedProps.meta.error).toEqual(true)
    expect(injectedProps.meta.helperText).toEqual('Field is required.')
  })
})
