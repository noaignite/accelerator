import * as React from 'react'
import { TextField } from '@mui/material'
import { useFormit } from '@noaignite/formit'
import { sleep } from '@noaignite/utils'

export default {
  title: 'formit/useFormit',
  component: useFormit,
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

const Template = () => {
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

export const Default = Template.bind({})
Default.args = {}
