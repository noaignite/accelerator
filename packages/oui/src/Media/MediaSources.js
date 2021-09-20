import * as React from 'react'
import PropTypes from 'prop-types'
import useTheme from '@material-ui/core/styles/useTheme'

/**
 * @ignore - internal component.
 */
function MediaSources(props) {
  const { breakpoints, lazy } = props

  const theme = useTheme()
  const keys = [...theme.breakpoints.keys].reverse()

  return keys.map((key) => {
    const breakpoint = breakpoints[key]
    const width = theme.breakpoints.values[key]
    const media = `(min-width: ${width}px)`

    if (breakpoint === undefined) {
      return null
    }

    if (typeof breakpoint === 'string') {
      return <source key={key} media={media} srcSet={!lazy ? breakpoint : undefined} />
    }

    return breakpoint.map(({ src, type }) => (
      <source key={key + type} media={media} srcSet={!lazy ? src : undefined} type={type} />
    ))
  })
}

const sourceType = PropTypes.shape({
  src: PropTypes.string.isRequired,
  type: PropTypes.string,
})

MediaSources.propTypes = {
  breakpoints: PropTypes.shape({
    xs: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(sourceType)]).isRequired,
    sm: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(sourceType)]),
    md: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(sourceType)]),
    lg: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(sourceType)]),
    xl: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(sourceType)]),
  }).isRequired,
  lazy: PropTypes.bool,
}

export default MediaSources