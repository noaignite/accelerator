import * as React from 'react'

const FormitContext = React.createContext({})

if (process.env.NODE_ENV !== 'production') {
  FormitContext.displayName = 'FormitContext'
}

export const FormitProvider = FormitContext.Provider
export const FormitConsumer = FormitContext.Consumer

export function useFormitContext() {
  return React.useContext(FormitContext)
}

export default FormitContext
