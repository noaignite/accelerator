import * as React from 'react'
import PropTypes from 'prop-types'

/**
 * @ignore - internal component.
 */
function MediaSources(props) {
  const { lazy, sources } = props

  return sources.map(({ max, min, src, ...other }, idx) => {
    const media = `(min-width: ${min}px)`
    const srcSet = !lazy ? src : undefined

    return <source key={idx} media={media} srcSet={srcSet} {...other} />
  })
}

MediaSources.propTypes = {
  lazy: PropTypes.bool,
  sources: PropTypes.arrayOf(
    PropTypes.shape({
      max: PropTypes.number,
      min: PropTypes.number.isRequired,
      src: PropTypes.string.isRequired,
    }),
  ).isRequired,
}

export default MediaSources
