import * as React from 'react'
import isEqual from 'react-fast-compare'
import { isPromise, getIn, setIn, useEventCallback } from './utils'

const emptyErrorMessages = {}
const emptyErrors = {}
const emptyValues = {}

/**
 * Universal Form Hanlder, heavily inspired by Formik.
 * Github: https://github.com/formik/formik/
 */
function useFormit(options = {}) {
  const initialStatusRef = React.useRef(options.initialStatus)
  const errorMessagesRef = React.useRef(options.errorMessages || emptyErrorMessages)
  const initialErrorsRef = React.useRef(options.initialErrors || emptyErrors)
  const initialValuesRef = React.useRef(options.initialValues || emptyValues)
  const mountedRef = React.useRef(false)

  const [isSubmitting, setSubmitting] = React.useState(false)
  const [state, setState] = React.useState({
    status: initialStatusRef.current,
    errors: initialErrorsRef.current,
    values: initialValuesRef.current,
  })

  const resetForm = React.useCallback(() => {
    setState({
      status: initialStatusRef.current,
      errors: initialErrorsRef.current,
      values: initialValuesRef.current,
    })
  }, [])

  const setStatus = React.useCallback((status) => {
    setState((prev) => ({ ...prev, status }))
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

  const onChange = React.useCallback((event, valueOrChild) => {
    const { name, validity, value: eventValue } = event.target

    let error
    if (validity && !validity.valid) {
      error = errorMessagesRef.current[name]
    }

    let value = eventValue
    if (valueOrChild !== undefined) {
      value = valueOrChild.props?.value ?? valueOrChild
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
    setStatus,
    setSubmitting,
    setValues,
  }

  const onReset = useEventCallback((event) => {
    if (event && event.preventDefault) {
      event.preventDefault()
    }

    if (options.onReset) {
      const maybePromisedOnReset = options.onReset(state.values, imperativeMethods)

      if (isPromise(maybePromisedOnReset)) {
        maybePromisedOnReset.then(resetForm)
      } else {
        resetForm()
      }
    } else {
      resetForm()
    }
  })

  const onSubmit = useEventCallback((event) => {
    if (event && event.preventDefault) {
      event.preventDefault()
    }

    if (options.onSubmit) {
      options.onSubmit(state.values, imperativeMethods)
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
        onChange,
        value: getIn(state.values, name),
      }

      const fieldError = getIn(state.errors, name)
      if (fieldError) {
        fieldProps.error = true
        fieldProps.helperText = fieldError
      }

      return fieldProps
    },
    [onChange, state],
  )

  React.useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  React.useEffect(() => {
    if (
      options.enableReinitialize &&
      mountedRef.current === true &&
      !isEqual(errorMessagesRef.current, options.errorMessages)
    ) {
      errorMessagesRef.current = options.errorMessages || emptyErrorMessages
    }
  }, [options.enableReinitialize, options.errorMessages])

  React.useEffect(() => {
    if (
      options.enableReinitialize &&
      mountedRef.current === true &&
      !isEqual(initialErrorsRef.current, options.initialErrors)
    ) {
      initialErrorsRef.current = options.initialErrors || emptyErrors
    }
  }, [options.enableReinitialize, options.initialErrors])

  React.useEffect(() => {
    if (
      options.enableReinitialize &&
      mountedRef.current === true &&
      !isEqual(initialValuesRef.current, options.initialValues)
    ) {
      initialValuesRef.current = options.initialValues || emptyValues
      resetForm()
    }
  }, [options.enableReinitialize, options.initialValues, resetForm])

  return {
    ...state,
    getFieldHelpers,
    getFieldProps,
    initialErrors: initialErrorsRef.current,
    initialStatus: initialStatusRef.current,
    initialValues: initialValuesRef.current,
    isSubmitting,
    onChange,
    onReset,
    onSubmit,
    resetForm,
    setErrors,
    setFieldError,
    setFieldValue,
    setSubmitting,
    setValues,
  }
}

export default useFormit
