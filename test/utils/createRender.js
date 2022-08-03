// Based on: https://github.com/mui/material-ui/blob/v4.12.4/test/utils/createClientRender.js

import * as React from 'react'
import { render as testingLibraryRender } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PropTypes from 'prop-types'

function render(element, options = {}) {
  const { strict = false, wrapper: InnerWrapper, wrapperProps, ...localOptions } = options

  const user = userEvent.setup()

  const Mode = strict ? React.StrictMode : React.Fragment
  function Wrapper({ children }) {
    return (
      <Mode>
        <InnerWrapper {...wrapperProps}>{children}</InnerWrapper>
      </Mode>
    )
  }
  Wrapper.propTypes = { children: PropTypes.node }

  const result = testingLibraryRender(element, { wrapper: Wrapper, ...localOptions })

  /**
   * Convenience helper. Better than repeating all props.
   */
  result.setProps = function setProps(props) {
    result.rerender(React.cloneElement(element, props))
    return result
  }

  /**
   * Setup userEvent, based on:
   * https://testing-library.com/docs/user-event/intro/#writing-tests-with-userevent
   */
  result.user = user

  return result
}

export default function createRender(globalOptions = {}) {
  const {
    strict: globalStrict,
    wrapper: globalWrapper = React.Fragment,
    wrapperProps: globalWrapperProps,
  } = globalOptions

  return function configuredRender(element, options = {}) {
    const {
      strict = globalStrict,
      wrapper = globalWrapper,
      wrapperProps = globalWrapperProps,
      ...localOptions
    } = options

    return render(element, {
      strict,
      wrapper,
      wrapperProps,
      ...localOptions,
    })
  }
}
