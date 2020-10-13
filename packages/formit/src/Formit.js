import * as React from 'react'
import PropTypes from 'prop-types'
import useFormit from './useFormit'
import FormitContext from './FormitContext'

function Formit(props) {
  const { children, ...other } = props

  const contextValue = useFormit(other)

  return (
    <FormitContext.Provider value={contextValue}>
      {typeof children === 'function' ? children(contextValue) : children}
    </FormitContext.Provider>
  )
}

Formit.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
}

export default Formit
