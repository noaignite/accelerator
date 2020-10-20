import * as React from 'react'
import isEqual from 'react-fast-compare'
import { isObject, isPromise, getIn, setIn, useEventCallback } from './utils'

/** Return multi select values based on an array of options */
function getSelectedValues(options) {
  return Array.from(options)
    .filter((el) => el.selected)
    .map((el) => el.value)
}

/** Return the next value for a checkbox */
function getValueForCheckbox(currentValue, checked, valueProp) {
  // If the current value was a boolean, return a boolean
  if (typeof currentValue === 'boolean') {
    return Boolean(checked)
  }

  // If the currentValue was not a boolean we want to return an array
  let currentArrayOfValues = []
  let isValueInArray = false
  let index = -1

  if (!Array.isArray(currentValue)) {
    // eslint-disable-next-line
    if (!valueProp || valueProp == 'true' || valueProp == 'false') {
      return Boolean(checked)
    }
  } else {
    // If the current value is already an array, use it
    currentArrayOfValues = currentValue
    index = currentValue.indexOf(valueProp)
    isValueInArray = index >= 0
  }

  // If the checkbox was checked and the value is not already present in the aray we want to add the new value to the array of values
  if (checked && valueProp && !isValueInArray) {
    return currentArrayOfValues.concat(valueProp)
  }

  // If the checkbox was unchecked and the value is not in the array, simply return the already existing array of values
  if (!isValueInArray) {
    return currentArrayOfValues
  }

  // If the checkbox was unchecked and the value is in the array, remove the value and return the array
  return currentArrayOfValues.slice(0, index).concat(currentArrayOfValues.slice(index + 1))
}

const emptyValidationErrors = {}
const emptyInitialErrors = {}
const emptyInitialValues = {}

/**
 * Universal Form Hanlder, heavily inspired by Formik.
 * Github: https://github.com/formik/formik/
 */
function useFormit(props = {}) {
  const initialStatusRef = React.useRef(props.initialStatus)
  const validationErrorsRef = React.useRef(props.validationErrors || emptyValidationErrors)
  const initialErrorsRef = React.useRef(props.initialErrors || emptyInitialErrors)
  const initialValuesRef = React.useRef(props.initialValues || emptyInitialValues)
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
        error = validationErrorsRef.current[name]
      }

      let value
      if (/checkbox/.test(type)) {
        value = getValueForCheckbox(getIn(state.values, name), checked, eventValue)
      } else if (/number|range/.test(type)) {
        const parsed = parseFloat(eventValue)
        value = isNaN(parsed) ? '' : parsed // eslint-disable-line no-restricted-globals
      } else if (multiple) {
        value = getSelectedValues(options)
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
      !isEqual(validationErrorsRef.current, props.validationErrors)
    ) {
      validationErrorsRef.current = props.validationErrors || emptyValidationErrors
    }
  }, [props.enableReinitialize, props.validationErrors])

  React.useEffect(() => {
    if (
      props.enableReinitialize &&
      mountedRef.current === true &&
      !isEqual(initialErrorsRef.current, props.initialErrors)
    ) {
      initialErrorsRef.current = props.initialErrors || emptyInitialErrors
    }
  }, [props.enableReinitialize, props.initialErrors])

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
    setSubmitting,
    setValues,
    validationErrors: validationErrorsRef.current,
  }
}

export default useFormit
