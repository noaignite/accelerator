import PropTypes from 'prop-types'
import mediaBreakpointType from './mediaBreakpointType'

const mediaBreakpointsType = PropTypes.shape({
  xs: mediaBreakpointType.isRequired,
  sm: mediaBreakpointType,
  md: mediaBreakpointType,
  lg: mediaBreakpointType,
  xl: mediaBreakpointType,
})

export default mediaBreakpointsType
