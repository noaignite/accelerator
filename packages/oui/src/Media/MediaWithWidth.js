// @inheritedComponent CardMedia

import * as React from 'react'
import PropTypes from 'prop-types'
import useTheme from '@material-ui/core/styles/useTheme'
import CardMedia from '@material-ui/core/CardMedia'
import useMediaQuery from '@material-ui/core/useMediaQuery'

/**
 * @ignore - internal component.
 */
const MediaWithWidth = React.forwardRef(function MediaWithWidth(props, ref) {
  const { breakpoints, component, ...other } = props

  const theme = useTheme()
  const keys = [...theme.breakpoints.keys].reverse()
  const breakpoint = keys.reduce((output, key) => {
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
  if (breakpoint === null) {
    return null
  }

  const { src, ...more } = typeof breakpoint !== 'object' ? { src: breakpoint } : breakpoint

  return <CardMedia component={component} image={src} ref={ref} {...more} {...other} />
})

MediaWithWidth.propTypes = {
  breakpoints: PropTypes.shape({
    xs: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    sm: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    md: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    lg: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    xl: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }),
  component: PropTypes.elementType,
}

export default MediaWithWidth
