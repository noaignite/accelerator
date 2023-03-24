import * as React from 'react'
import PropTypes from 'prop-types'
import { isFunction } from '../utils'
import { useFormitContext } from '../Formit/FormitContext'

const Field = React.forwardRef(function Field(props, ref) {
  const { children, component: Component = 'input', name, ...other } = props

  const { getFieldMeta, getFieldProps, setFieldError, setFieldValue } = useFormitContext()

  const setError = React.useCallback(
    (error) => {
      setFieldError(name, error)
    },
    [name, setFieldError],
  )

  const setValue = React.useCallback(
    (value) => {
      setFieldValue(name, value)
    },
    [name, setFieldValue],
  )

  // Use optional chaining to bypass ReactTestRenderer
  const field = getFieldProps?.(props)
  const meta = getFieldMeta?.(name)

  if (isFunction(children)) {
    return children({ field, meta, setError, setValue })
  }

  const componentProps = { ...field, ...other }
  const isReactElement = typeof Component.render === 'function' // Better way of typechecking?

  if (meta && meta.error && isReactElement) {
    componentProps.error = meta.error
    componentProps.helperText = meta.helperText
  }

  return (
    <Component ref={ref} {...componentProps}>
      {children}
    </Component>
  )
})

Field.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  component: PropTypes.elementType,
  name: PropTypes.string.isRequired,
}

export default Field
