import * as React from 'react'
import { TextField } from '@mui/material'
import { Field, Form, Formit, FormitConsumer, useFormit } from '@noaignite/formit'

export default {
  title: 'Components/Formit',
  component: Formit,
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function actionWithPromise(eventName, timeout) {
  return async (values, { setSubmitting }) => {
    setSubmitting(true)
    await sleep(timeout)
    setSubmitting(false)

    // eslint-disable-next-line no-console
    console.log(eventName, values)
  }
}

const formitProps = {
  initialValues: {
    email: '',
    password: '',
  },
  validationErrors: {
    email: 'Must be a valid email address',
    password: 'Must contain UpperCase, LowerCase, Number/SpecialChar and min 8 Chars',
  },
  onReset: actionWithPromise('onReset', 1000),
  onSubmit: actionWithPromise('onSubmit', 1000),
}

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
    pattern: '(?=^.{8,}$)((?=.*d)|(?=.*W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$',
  },
  margin: 'normal',
  fullWidth: true,
  required: true,
}

const Template1 = () => (
  <Formit {...formitProps}>
    <Form>
      <Field component={TextField} name="email" {...fieldEmailProps} />
      <Field name="password">
        {({ field, meta }) => <TextField {...fieldPasswordProps} {...field} {...meta} />}
      </Field>

      <FormitConsumer>
        {({ isSubmitting }) => (
          <React.Fragment>
            <input type="reset" value="Reset" disabled={isSubmitting} />
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>

            {isSubmitting && <p>Loading...</p>}
          </React.Fragment>
        )}
      </FormitConsumer>
    </Form>
  </Formit>
)

export const FormitContext = Template1.bind({})
FormitContext.args = {}

const Template2 = () => (
  <Formit {...formitProps}>
    {({ getFieldMeta, getFieldProps, isSubmitting, onReset, onSubmit }) => (
      <form onReset={onReset} onSubmit={onSubmit} action="#">
        <TextField {...fieldEmailProps} {...getFieldProps('email')} {...getFieldMeta('email')} />
        <TextField
          {...fieldPasswordProps}
          {...getFieldProps('password')}
          {...getFieldMeta('password')}
        />

        <input type="reset" value="Reset" disabled={isSubmitting} />
        <button type="submit" disabled={isSubmitting}>
          Submit
        </button>

        {isSubmitting && <p>Loading...</p>}
      </form>
    )}
  </Formit>
)

export const FormitRenderProps = Template2.bind({})
FormitRenderProps.args = {}

const Template3 = () => {
  const { getFieldMeta, getFieldProps, isSubmitting, onReset, onSubmit } = useFormit(formitProps)

  return (
    <section>
      <form onReset={onReset} onSubmit={onSubmit} action="#">
        <TextField {...fieldEmailProps} {...getFieldProps('email')} {...getFieldMeta('email')} />
        <TextField
          {...fieldPasswordProps}
          {...getFieldProps('password')}
          {...getFieldMeta('password')}
        />

        <input type="reset" value="Reset" disabled={isSubmitting} />
        <button type="submit" disabled={isSubmitting}>
          Submit
        </button>

        {isSubmitting && <p>Loading...</p>}
      </form>
    </section>
  )
}

export const UseFormit = Template3.bind({})
UseFormit.args = {}
