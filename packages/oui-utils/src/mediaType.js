import PropTypes from 'prop-types'

export const responsiveSrcType = PropTypes.shape({
  xs: PropTypes.any.isRequired,
  sm: PropTypes.any,
  md: PropTypes.any,
  lg: PropTypes.any,
  xl: PropTypes.any,
})

export const imageType = PropTypes.shape({
  alt: PropTypes.string,
  breakpoints: responsiveSrcType,
  src: PropTypes.string,
})

export const videoType = PropTypes.shape({
  breakpoints: responsiveSrcType,
  controls: PropTypes.bool,
  loop: PropTypes.bool,
  muted: PropTypes.bool,
  playsInline: PropTypes.bool,
  poster: PropTypes.string,
  src: PropTypes.string,
})

const mediaType = PropTypes.oneOfType([imageType, videoType])

export default mediaType
