import * as React from 'react'
import { act, createRender } from 'test/utils'
import useFormit from './useFormit'

const initialStatus = 'untouched'

const initialValues = {
  name: '',
}

const validationErrors = {
  name: 'Field is required',
}

const formitProps = {
  initialStatus,
  initialValues,
  validationErrors,
}

describe('useFormit', () => {
  const render = createRender()

  it('should return the entire formit object', () => {
    let injectedProps
    const Component = (props) => {
      injectedProps = useFormit(props)
      return null
    }

    render(<Component {...formitProps} />)

    const testKeys = [
      'errors',
      'getFieldHelpers',
      'getFieldMeta',
      'getFieldProps',
      'initialErrors',
      'initialStatus',
      'initialValues',
      'isSubmitting',
      'onChange',
      'onReset',
      'onSubmit',
      'resetForm',
      'setErrors',
      'setFieldError',
      'setFieldValue',
      'setStatus',
      'setSubmitting',
      'setValues',
      'status',
      'validationErrors',
      'values',
    ]

    testKeys.forEach((key) => {
      expect(key in injectedProps).toBe(true)
    })
  })

  it('should receive the state, be able to update it and thereafter reset it', () => {
    let injectedProps
    const Component = (props) => {
      injectedProps = useFormit(props)
      return null
    }

    render(<Component {...formitProps} />)

    expect(injectedProps.status).toBe(initialStatus)
    expect(injectedProps.errors.name).toBe(undefined)
    expect(injectedProps.values.name).toBe(initialValues.name)

    act(() => {
      injectedProps.setStatus('touched')
      injectedProps.setFieldError('name', validationErrors.name)
      injectedProps.setFieldValue('name', 'Jon')
    })
    expect(injectedProps.status).toBe('touched')
    expect(injectedProps.errors.name).toBe(validationErrors.name)
    expect(injectedProps.values.name).toBe('Jon')

    act(() => {
      injectedProps.resetForm()
    })
    expect(injectedProps.status).toBe(initialStatus)
    expect(injectedProps.errors.name).toBe(undefined)
    expect(injectedProps.values.name).toBe(initialValues.name)
  })

  it('should not update status, errors, or values unless `enableReinitialize` is true', () => {
    let injectedProps
    const Component = (props) => {
      const countRef = React.useRef(0)
      React.useEffect(() => {
        // Don't create an endless loop
        if (countRef.current === 0) {
          countRef.current += 1
        }
      })

      injectedProps = useFormit({
        initialStatus: countRef.current,
        initialValues: { count: countRef.current },
        initialErrors: { count: countRef.current },
        ...props,
      })
      return null
    }

    const { rerender } = render(<Component />)
    expect(injectedProps.status).toBe(0)
    expect(injectedProps.errors.count).toBe(0)
    expect(injectedProps.values.count).toBe(0)

    rerender(<Component />)
    expect(injectedProps.status).toBe(0)
    expect(injectedProps.errors.count).toBe(0)
    expect(injectedProps.values.count).toBe(0)

    rerender(<Component enableReinitialize />)
    expect(injectedProps.status).toBe(1)
    expect(injectedProps.errors.count).toBe(1)
    expect(injectedProps.values.count).toBe(1)
  })
})
