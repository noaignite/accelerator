// Based on: https://github.com/mui-org/material-ui/blob/next/test/utils/createClientRender.js

import * as React from 'react'
import { render as testingLibraryRender } from '@testing-library/react'
import PropTypes from 'prop-types'

function render(element, options = {}) {
  const { strict = false, wrapper: InnerWrapper, wrapperProps, ...localOptions } = options

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
   * convenience helper. Better than repeating all props.
   */
  result.setProps = function setProps(props) {
    result.rerender(React.cloneElement(element, props))
    return result
  }

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
      wrapperProps,
      ...localOptions
    } = options

    return render(element, {
      strict,
      wrapper,
      wrapperProps: {
        ...globalWrapperProps,
        ...wrapperProps,
      },
      ...localOptions,
    })
  }
}
