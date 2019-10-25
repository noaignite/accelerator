// @inheritedComponent CardMedia

import React from 'react'
import PropTypes from 'prop-types'
import withWidth, { isWidthUp } from '@material-ui/core/withWidth'
import CardMedia from '@material-ui/core/CardMedia'

/**
 * @ignore - internal component.
 */
const MediaWithWidth = React.forwardRef(function MediaWithWidth(props, ref) {
  const { breakpoints, component, theme, width, ...other } = props

  const keys = [...theme.breakpoints.keys].reverse()
  let componentProps = {}

  for (let index = 0; index < keys.length; index += 1) {
    const key = keys[index]
    const breakpoint = breakpoints[key]

    if (breakpoint && isWidthUp(key, width)) {
      if (typeof breakpoint === 'object') {
        const { src, ...more } = breakpoint
        componentProps = {
          image: src,
          ...more,
        }
      } else {
        componentProps.image = breakpoint
      }
      break
    }
  }

  return <CardMedia component={component} ref={ref} {...componentProps} {...other} />
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
  theme: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
}

export default withWidth({ withTheme: true })(MediaWithWidth)
