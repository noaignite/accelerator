import * as React from 'react'
import isEqual from 'react-fast-compare'
import {
  getCheckboxValue,
  getIn,
  getSelectMultipleValues,
  isObject,
  isPromise,
  setIn,
  useEventCallback,
} from './utils'

const emptyValidationErrors = {}
const emptyInitialErrors = {}
const emptyInitialValues = {}

/**
 * Universal Form Hanlder, heavily inspired by Formik.
 * Github: https://github.com/formik/formik/
 */
function useFormit(props = {}) {
  const initialStatusRef = React.useRef(props.initialStatus)
  const initialErrorsRef = React.useRef(props.initialErrors || emptyInitialErrors)
  const initialValuesRef = React.useRef(props.initialValues || emptyInitialValues)
  const validationErrorsRef = React.useRef(props.validationErrors || emptyValidationErrors)
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

  const onChange = React.useCallback(
    (event) => {
      const { checked, multiple, name, options, type, validity, value: eventValue } = event.target

      let error
      if (validity && !validity.valid) {
        error = getIn(validationErrorsRef.current, name)
      }

      let value
      if (/checkbox/.test(type)) {
        value = getCheckboxValue(getIn(state.values, name), checked, eventValue)
      } else if (/number|range/.test(type)) {
        const parsed = parseFloat(eventValue)
        value = isNaN(parsed) ? '' : parsed // eslint-disable-line no-restricted-globals
      } else if (multiple) {
        value = getSelectMultipleValues(options)
      } else {
        value = eventValue
      }

      setState((prev) => ({
        errors: setIn(prev.errors, name, error),
        values: setIn(prev.values, name, value),
      }))
    },
    [state.values],
  )

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

  const onSubmit = useEventCallback((event) => {
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

  const getFieldMeta = React.useCallback(
    (nameOrOptions) => {
      const isOptions = isObject(nameOrOptions)
      const name = isOptions ? nameOrOptions.name : nameOrOptions

      const fieldMeta = {
        error: !!getIn(state.errors, name),
        helperText: getIn(state.errors, name),
        // Should these accessible via meta?
        // initialError: getIn(initialErrorsRef.current, name),
        // initialValue: getIn(initialValuesRef.current, name),
        // validationError: getIn(validationErrorsRef.current, name),
      }

      return fieldMeta
    },
    [state.errors],
  )

  const getFieldProps = React.useCallback(
    (nameOrOptions) => {
      const isOptions = isObject(nameOrOptions)
      const name = isOptions ? nameOrOptions.name : nameOrOptions
      const valueState = getIn(state.values, name)

      const fieldProps = {
        name,
        onChange,
        value: valueState,
      }

      if (isOptions) {
        const {
          component,
          control,
          multiple,
          select,
          type,
          value: valueProp, // value is special for checkboxes
        } = nameOrOptions

        // Better way to typecheck this?
        let formControlLabelType
        if (control && React.isValidElement(control)) {
          formControlLabelType = 'radio'

          if (valueProp === undefined || Array.isArray(valueState)) {
            formControlLabelType = 'checkbox'
          }
        }

        if (type === 'checkbox' || formControlLabelType === 'checkbox') {
          if (valueProp === undefined) {
            fieldProps.checked = valueState
          } else {
            fieldProps.checked = Array.isArray(valueState) && valueState.includes(valueProp)
            fieldProps.value = valueProp
          }
        } else if (type === 'radio' || formControlLabelType === 'radio') {
          fieldProps.checked = valueState === valueProp
          fieldProps.value = valueProp
        } else if ((component === 'select' || select) && multiple) {
          fieldProps.value = fieldProps.value || []
          fieldProps.multiple = true
        }
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
      props.enableReinitialize &&
      mountedRef.current === true &&
      !isEqual(initialStatusRef.current, props.initialStatus)
    ) {
      initialStatusRef.current = props.initialStatus
      setStatus(props.initialStatus)
    }
  }, [props.enableReinitialize, props.initialStatus, setStatus])

  React.useEffect(() => {
    if (
      props.enableReinitialize &&
      mountedRef.current === true &&
      !isEqual(initialErrorsRef.current, props.initialErrors)
    ) {
      initialErrorsRef.current = props.initialErrors || emptyInitialErrors
      setErrors(props.initialErrors || emptyInitialErrors)
    }
  }, [props.enableReinitialize, props.initialErrors, setErrors])

  React.useEffect(() => {
    if (
      props.enableReinitialize &&
      mountedRef.current === true &&
      !isEqual(initialValuesRef.current, props.initialValues)
    ) {
      initialValuesRef.current = props.initialValues || emptyInitialValues
      resetForm()
    }
  }, [props.enableReinitialize, props.initialValues, resetForm])

  React.useEffect(() => {
    if (
      props.enableReinitialize &&
      mountedRef.current === true &&
      !isEqual(validationErrorsRef.current, props.validationErrors)
    ) {
      validationErrorsRef.current = props.validationErrors || emptyValidationErrors
    }
  }, [props.enableReinitialize, props.validationErrors])

  return {
    ...state,
    getFieldHelpers,
    getFieldMeta,
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
    setStatus,
    setSubmitting,
    setValues,
    validationErrors: validationErrorsRef.current,
  }
}

export default useFormit
