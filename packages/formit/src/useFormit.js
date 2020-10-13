import * as React from 'react'
import isEqual from 'react-fast-compare'
import useEventCallback from '@oakwood/oui-utils/useEventCallback'
import { isPromise, getIn, setIn } from './utils'

const emptyErrorMessages = {}
const emptyErrors = {}
const emptyValues = {}

/**
 * Universal Form Hanlder, heavily inspired by Formik.
 *
 * Github: https://github.com/formik/formik/
 */
function useFormit(props = {}) {
  const errorMessagesRef = React.useRef(props.errorMessages || emptyErrorMessages)
  const initialErrorsRef = React.useRef(props.initialErrors || emptyErrors)
  const initialValuesRef = React.useRef(props.initialValues || emptyValues)
  const mountedRef = React.useRef(false)

  const [submitting, setSubmitting] = React.useState(false)
  const [state, setState] = React.useState({
    errors: initialErrorsRef.current,
    values: initialValuesRef.current,
  })

  const resetForm = React.useCallback(() => {
    setState({
      errors: initialErrorsRef.current,
      values: initialValuesRef.current,
    })
  }, [])

  const setErrors = React.useCallback((errors) => {
    setState((prev) => ({ ...prev, errors }))
  }, [])

  const setValues = React.useCallback((values) => {
    setState((prev) => ({ ...prev, values }))
  }, [])

  const setFieldError = React.useCallback((name, error) => {
    setState((prev) => ({ ...prev, errors: setIn(prev.errors, name, error) }))
  }, [])

  const setFieldValue = React.useCallback((name, value) => {
    setState((prev) => ({ ...prev, values: setIn(prev.values, name, value) }))
  }, [])

  const handleChange = React.useCallback((event, syntheticValue) => {
    const { name, validity, value: eventValue } = event.target

    let error
    if (validity && !validity.valid) {
      error = errorMessagesRef.current[name]
    }

    let value = eventValue
    if (syntheticValue !== undefined) {
      value = syntheticValue?.props?.value ?? syntheticValue // `syntheticValue` for MuiSelect & MuiCheckbox/MuiRadio
    }

    setState((prev) => ({
      errors: setIn(prev.errors, name, error),
      values: setIn(prev.values, name, value),
    }))
  }, [])

  const imperativeMethods = {
    resetForm,
    setErrors,
    setFieldError,
    setFieldValue,
    setSubmitting,
    setValues,
  }

  const handleReset = useEventCallback((event) => {
    if (event && event.preventDefault) {
      event.preventDefault()
    }

    if (props.onReset) {
      const maybePromisedOnReset = props.onReset(state.values, imperativeMethods)

      if (isPromise(maybePromisedOnReset)) {
        maybePromisedOnReset.then(resetForm)
      } else {
        resetForm()
      }
    } else {
      resetForm()
    }
  })

  const handleSubmit = useEventCallback((event) => {
    if (event && event.preventDefault) {
      event.preventDefault()
    }

    if (props.onSubmit) {
      props.onSubmit(state.values, imperativeMethods)
    }
  })

  const getFieldHelpers = React.useCallback(
    (name) => ({
      setError: (error) => setFieldError(name, error),
      setValue: (value) => setFieldValue(name, value),
    }),
    [setFieldError, setFieldValue],
  )

  const getFieldProps = React.useCallback(
    (name) => {
      const fieldProps = {
        name,
        onChange: handleChange,
        value: getIn(state.values, name),
      }

      const fieldError = getIn(state.errors, name)
      if (fieldError) {
        fieldProps.error = true
        fieldProps.helperText = fieldError
      }

      return fieldProps
    },
    [handleChange, state],
  )

  React.useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  React.useEffect(() => {
    if (
      props.enableReinitialize &&
      mountedRef.current === true &&
      !isEqual(errorMessagesRef.current, props.errorMessages)
    ) {
      errorMessagesRef.current = props.errorMessages || emptyErrorMessages
    }
  }, [props.enableReinitialize, props.errorMessages])

  React.useEffect(() => {
    if (
      props.enableReinitialize &&
      mountedRef.current === true &&
      !isEqual(initialErrorsRef.current, props.initialErrors)
    ) {
      initialErrorsRef.current = props.initialErrors || emptyErrors
    }
  }, [props.enableReinitialize, props.initialErrors])

  React.useEffect(() => {
    if (
      props.enableReinitialize &&
      mountedRef.current === true &&
      !isEqual(initialValuesRef.current, props.initialValues)
    ) {
      initialValuesRef.current = props.initialValues || emptyValues
      resetForm()
    }
  }, [props.enableReinitialize, props.initialValues, resetForm])

  return {
    ...state,
    getFieldHelpers,
    getFieldProps,
    handleChange,
    handleReset,
    handleSubmit,
    resetForm,
    setErrors,
    setFieldError,
    setFieldValue,
    setSubmitting,
    setValues,
    submitting,
  }
}

export default useFormit
