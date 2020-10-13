import * as React from 'react'
import TextField from '@material-ui/core/TextField'
import { Field, Form, Formit, FormitConsumer, useFormit } from '@oakwood/formit'

export default {
  title: 'Components/Formit',
  component: Formit,
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const actionWithPromise = (eventName, timeout) => async (values, { setSubmitting }) => {
  setSubmitting(true)
  await sleep(timeout)
  setSubmitting(false)

  // eslint-disable-next-line no-console
  console.log(eventName, values)
}

const initialValues = {
  email: '',
  password: '',
}

const errorMessages = {
  email: 'Must be a valid email address',
  password: 'Must contain UpperCase, LowerCase, Number/SpecialChar and min 8 Chars',
}

const onReset = actionWithPromise('onReset', 1000)
const onSubmit = actionWithPromise('onSubmit', 1000)

const fieldEmailProps = {
  placeholder: 'jon@formit.com',
  label: 'E-mail',
  type: 'email',
  margin: 'normal',
  fullWidth: true,
  required: true,
}

const fieldPasswordProps = {
  label: 'Password',
  type: 'password',
  inputProps: {
    // eslint-disable-next-line no-useless-escape
    pattern: '(?=^.{8,}$)((?=.*d)|(?=.*W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$',
  },
  margin: 'normal',
  fullWidth: true,
  required: true,
}

const Template1 = () => {
  const { handleSubmit, handleReset, getFieldProps, submitting } = useFormit({
    initialValues,
    errorMessages,
    onReset,
    onSubmit,
  })

  return (
    <form onSubmit={handleSubmit} onReset={handleReset} action="#">
      <TextField {...fieldEmailProps} {...getFieldProps('email')} />

      <TextField {...fieldPasswordProps} {...getFieldProps('password')} />

      <input type="reset" value="Reset" disabled={submitting} />
      <button type="submit" disabled={submitting}>
        Submit
      </button>

      {submitting && <p>Loading...</p>}
    </form>
  )
}

export const UseFormit = Template1.bind({})
UseFormit.args = {}

const Template2 = () => {
  return (
    <Formit
      initialValues={initialValues}
      errorMessages={errorMessages}
      onReset={onReset}
      onSubmit={onSubmit}
    >
      {({ handleSubmit, handleReset, getFieldProps, submitting }) => (
        <form onSubmit={handleSubmit} onReset={handleReset} action="#">
          <TextField {...fieldEmailProps} {...getFieldProps('email')} />

          <TextField {...fieldPasswordProps} {...getFieldProps('password')} />

          <input type="reset" value="Reset" disabled={submitting} />
          <button type="submit" disabled={submitting}>
            Submit
          </button>

          {submitting && <p>Loading...</p>}
        </form>
      )}
    </Formit>
  )
}

export const FormitRenderProps = Template2.bind({})
FormitRenderProps.args = {}

const Template3 = () => {
  return (
    <Formit
      initialValues={initialValues}
      errorMessages={errorMessages}
      onReset={onReset}
      onSubmit={onSubmit}
    >
      <Form>
        <Field component={TextField} name="email" {...fieldEmailProps} />

        <Field name="password">
          {(fieldProps) => <TextField {...fieldPasswordProps} {...fieldProps} />}
        </Field>

        <FormitConsumer>
          {({ submitting }) => (
            <>
              <input type="reset" value="Reset" disabled={submitting} />
              <button type="submit" disabled={submitting}>
                Submit
              </button>

              {submitting && <p>Loading...</p>}
            </>
          )}
        </FormitConsumer>
      </Form>
    </Formit>
  )
}

export const FormitContext = Template3.bind({})
FormitContext.args = {}
