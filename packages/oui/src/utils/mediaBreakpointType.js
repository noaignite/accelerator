import PropTypes from 'prop-types'

const mediaBreakpointType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.object,
  PropTypes.arrayOf(PropTypes.object),
])

export default mediaBreakpointType
