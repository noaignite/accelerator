// @inheritedComponent MediaBase

import * as React from 'react'
import PropTypes from 'prop-types'
import useTheme from '@material-ui/core/styles/useTheme'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import MediaBase from '../MediaBase'

/**
 * @ignore - internal component.
 */
const MediaWithWidth = React.forwardRef(function MediaWithWidth(props, ref) {
  const { breakpoints, ...other } = props

  const theme = useTheme()
  const keys = [...theme.breakpoints.keys].reverse()
  const src = keys.reduce((output, key) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const matches = useMediaQuery(theme.breakpoints.up(key))
    return !output && matches ? breakpoints[key] : output
  }, null)

  // When rendering the component on the server,
  // we have no idea about the client browser screen width.
  // In order to prevent blinks and help the reconciliation of the React tree
  // we are not rendering the child component.
  //
  // An alternative is to implement a `ssrMatchMedia`.
  // https://material-ui.com/components/use-media-query/#server-side-rendering
  if (src === null) {
    return null
  }

  const componentProps = typeof src !== 'object' ? { src } : src

  return <MediaBase ref={ref} {...componentProps} {...other} />
})

MediaWithWidth.propTypes = {
  breakpoints: PropTypes.shape({
    xs: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    sm: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    md: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    lg: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    xl: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }),
}

export default MediaWithWidth
