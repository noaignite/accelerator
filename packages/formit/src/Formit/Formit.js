import * as React from 'react'
import PropTypes from 'prop-types'
import { isFunction } from '../utils'
import useFormit from '../useFormit'
import FormitContext from './FormitContext'

function Formit(props) {
  const { children, ...other } = props

  const ctx = useFormit(other)

  return (
    <FormitContext.Provider value={ctx}>
      {isFunction(children) ? children(ctx) : children}
    </FormitContext.Provider>
  )
}

Formit.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
}

export default Formit
