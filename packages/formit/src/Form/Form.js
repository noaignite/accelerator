import * as React from 'react'
import PropTypes from 'prop-types'
import { isFunction } from '../utils'
import { useFormitContext } from '../Formit/FormitContext'

const Form = React.forwardRef(function Form(props, ref) {
  const { action: actionProp, children, ...other } = props

  const { onReset, onSubmit, ...ctx } = useFormitContext()

  // iOS needs an "action" attribute for nice input: https://stackoverflow.com/a/39485162/406725
  // We default the action to "#" in case the preventDefault fails (just updates the URL hash)
  const action = actionProp || '#'

  return (
    <form action={action} onReset={onReset} onSubmit={onSubmit} ref={ref} {...other}>
      {isFunction(children) ? children(ctx) : children}
    </form>
  )
})

Form.propTypes = {
  action: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default Form
