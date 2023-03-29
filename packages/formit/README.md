# @noaignite/formit

Form helper hook & components built with [React](https://reactjs.org/) and [MUI](https://mui.com/) in mind. Heavily inspired by [Formik](https://formik.org/).

## Motivation

The main motivation was to create a standardized way of handling form fields using native browser APIs for the build footprint to be as small as possible. Validation is therefore meant to be implemented directly in the html with attributes like `required`, `type="email"`, `pattern="[0-9]{4}"` and so on. Secondly, to have a simple way of using this library together with [MUI](https://mui.com/).

## Installation

Formit is available as an [npm package](https://www.npmjs.com/package/@noaignite/formit).

```sh
// with npm
npm install @noaignite/formit

// with yarn
yarn add @noaignite/formit
```

## Usage

There's two ways of using formit, the first being via the `useFormit` hook and secondly via the formit components. These being `Formit`, `Form`, `Field` & `FormitConsumer`. Let's look at how these can be implemented.

### Using the hook

Using the `useFormit` hook is the simplest way to use formit and handle your forms. The `initialValues` key is mandatory, and is used for registering all the fields that you want to be controlled by formit. The `validationErrors` key is optional and can be used for printing error messages based on the validation rules you've defined in the html of each respective form field. The `onSubmit` callback will give you the controlled values as the first argument and actions as the second argument. In the example below we use the `setSubmitting` action to set formit into a loading state, momentarily disabling the submit button until the Promise has been resolved.

```jsx
import * as React from 'react'
import { TextField } from '@mui/material'
import { useFormit } from '@noaignite/formit'

const BasicExample = () => {
  const { getFieldMeta, getFieldProps, isSubmitting, onSubmit } = useFormit({
    initialValues: {
      email: '',
      password: '',
    },
    validationErrors: {
      email: 'Please enter a valid email address',
      password: 'Password must contain an uppercase letter, a lowercase letter, and a number',
    },
    onSubmit: async (values, { setSubmitting /*, and more */ }) => {
      setSubmitting(true)
      await new Promise((resolve) => setTimeout(() => {
        console.log(values)
        resolve()
      }, 1000))
      setSubmitting(false)
    }
  })

  return (
    <form onSubmit={onSubmit}>
      <h1>My formit form</h1>
    
      <TextField
        type="email" // Email validation.
        required // Required validation.
        {...getFieldProps('email')} // Sets `name`, `value` & `onChange`.
        {...getFieldMeta('email')} // Sets Mui specific `error` and `herlperText`.
        label="Email"
      />

      <TextField
        pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$" // Password validation.
        required // Required validation.
        {...getFieldProps('password')} // Sets `name`, `value` & `onChange`.
        {...getFieldMeta('password')} // Sets Mui specific `error` and `herlperText`.
        label="Password"
        type="password"
      />

      <button type="submit" disabled={isSubmitting}>Submit</button>
    </form>
  )
}

export default BasicExample
```


### Using the context components

Using the context components is very similar to using the `useFormit` hook. The difference being that the formit state is saved to a React context using the `Formit` component, this is then consumed by formit's context components. The advantage to this approach is that your component, in this case `BasicExample`, won't have to re-render for each keystroke as the `values` & `errors` state updates. In the example below, `<h1>My formit form</h1>` won't re-render as you type into the the form fields.

A potential downside to this approach can be that it's more difficult to organize your logic. Try out the different approaches and use the one that suits your need the best.

```jsx
import * as React from 'react'
import { TextField } from '@mui/material'
import { Formit, Form, Field, FormitConsumer } from '@noaignite/formit'

const BasicExample = () => {
  return (
    <Formit
      initialValues={{
        email: '',
        password: '',
      }}
      validationErrors={{
        email: 'Please enter a valid email address',
        password: 'Password must contain an uppercase letter, a lowercase letter, and a number',
      }}
      onSubmit={async (values, { setSubmitting /*, and more */ }) => {
        setSubmitting(true)
        await new Promise((resolve) => setTimeout(() => {
          console.log(values)
          resolve()
        }, 1000))
        setSubmitting(false)
      }}
    >
      <Form>
        <h1>My formit form</h1>

        <Field
          component={TextField} // Renders Mui TextField.
          name="email" // Sets values from `getFieldProps` & `getFieldMeta` based on `name`.
          type="email" // Email validation.
          required // Required validation.
          label="Email"
        />

        <Field
          component={TextField} // Renders Mui TextField.
          name="password" // Sets values from `getFieldProps` & `getFieldMeta` based on `name`.
          pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$" // Password validation.
          required // Required validation.
          type="password"
          label="Password"
        />

        <FormitConsumer>
          {({ isSubmitting }) => (
            <button type="submit" disabled={isSubmitting}>Submit</button>
          )}
        </FormitConsumer>
      </Form>
    </Formit>
  )
}

export default BasicExample
```

#### Sourcing values from API call

Sometimes, the "initial values" you want to edit via Formit originates from an API.

**Note:** jHence `Formit` always want an `initialValue` object, but our actual "initial values" are retrieved
asynchronously, we need to add the `enableReinitialize` prop to the `Formit` component.

```jsx
const BasicExample = () => {
  const [initialValues, setInitialValues] = React.useState({
    email: '',
    password: '',
  })

  React.useEffect(() => {
    const fetch = async () => {
      // Faked API call, for demonstration.
      await new Promise((resolve) =>
        setTimeout(() => {
          const apiOriginatedInitialValues = {
            email: 'john.doe@example.com',
            password: '****',
          }

          setInitialValues(apiOriginatedInitialValues)
          resolve()
        }, 1000),
      )
    }

    fetch()
  }, [setInitialValues])

  return (
    <Formit
      initialValues={initialValues}
      enableReinitialize
      // ...
    >
      <Form>
        <h1>My formit form</h1>

        <Field
          component={TextField} // Renders Mui TextField.
          name="email" // Sets values from `getFieldProps` & `getFieldMeta` based on `name`.
          type="email" // Email validation.
          required // Required validation.
          label="Email"
        />

        <Field
          component={TextField} // Renders Mui TextField.
          name="password" // Sets values from `getFieldProps` & `getFieldMeta` based on `name`.
          pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$" // Password validation.
          required // Required validation.
          type="password"
          label="Password"
        />

        <FormitConsumer>
          {({ isSubmitting }) => (
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          )}
        </FormitConsumer>
      </Form>
    </Formit>
  )
}
```

#### The Field component

Worth mentioning regarding the `Field` component is that it also accepts a function as it's `children` prop, exposing field specific formit state and functions. This can be handy in those cases where one might need to tweak the behaviour, for example for the [Mui Datepicker](https://mui.com/x/react-date-pickers/date-picker/) where the onChange argument does not expose the event as it's argument.

```jsx
<Field name="date">
  {({ field, setValue }) => (
    <DatePicker
      label="Date"
      name={field.name}
      value={field.value}
      onChange={(newValue) => setValue(newValue)}
    />
  )}
</Field>
```

### Preparing your data for the API request

A lot of times your form data will need to comply with a certain data structure that the recipient API requires. In these cases formit can help you out by allowing you to predefine the data structure of your form values so it's ready to be sent to the API. Let's look at how this can be done.

```jsx
import * as React from 'react'
import { Checkbox, FormControlLabel, TextField } from '@mui/material'
import { Formit, Form, Field, FormitConsumer } from '@noaignite/formit'

const BasicExample = () => {
  return (
    <Formit
      initialValues={{
        user: {
          firstName: '',
          lastName: '',
          phoneNumbers: ['', ''],
        },
        newsletter: false,
      }}
      onSubmit={(values) => {
        /*
        `values` would then be structured like below:
        {
          user: {
            firstName: 'Jon',
            lastName: 'Doe',
            phoneNumbers: ['111111111', '222222222'],
          },
          newsletter: true,
        }
        */
        console.log(values)
      }}
    >
      <Form>
        <h1>My formit form</h1>

        <Field
          component={TextField}
          name="user.firstName" // Path to formit state
          label="First name"
        />

        <Field
          component={TextField}
          name="user.lastName" // Path to formit state
          label="Last name"
        />
        
        <Field
          component={TextField}
          name="user.phoneNumbers[0]" // Path to formit state
          label="Primary phone number"
        />
        
        <Field
          component={TextField}
          name="user.phoneNumbers[1]" // Path to formit state
          label="Secondary phone number"
        />
        
        <Field
          component={FormControlLabel}
          control={<Checkbox />}
          name="newsletter" // Path to formit state
          label="Newsletter"
        />

        <FormitConsumer>
          {({ isSubmitting }) => (
            <button type="submit" disabled={isSubmitting}>Submit</button>
          )}
        </FormitConsumer>
      </Form>
    </Formit>
  )
}

export default BasicExample
```

