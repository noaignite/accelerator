import * as React from 'react'
import PropTypes from 'prop-types'
import { useFormitContext } from './FormitContext'

const Field = React.forwardRef(function Field(props, ref) {
  const { children, component: Component = 'input', name, ...other } = props

  const { getFieldProps } = useFormitContext()
  const fieldProps = getFieldProps(name)

  if (typeof children === 'function') {
    return children(fieldProps)
  }

  return (
    <Component ref={ref} {...fieldProps} {...other}>
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
