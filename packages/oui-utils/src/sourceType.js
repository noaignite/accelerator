import PropTypes from 'prop-types'

const sourceType = PropTypes.shape({
  src: PropTypes.string.isRequired,
  type: PropTypes.string,
})

export default sourceType
