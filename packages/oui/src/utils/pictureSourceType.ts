import PropTypes from 'prop-types'

const pictureSourceType = PropTypes.shape({
  media: PropTypes.string.isRequired,
  sizes: PropTypes.string,
  srcSet: PropTypes.string.isRequired,
  type: PropTypes.string,
})

export default pictureSourceType
