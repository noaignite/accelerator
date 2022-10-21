import * as React from 'react'
import PropTypes from 'prop-types'
import { OverridableComponent } from '@mui/types'
import { Breakpoint } from '@mui/system'
import { useMediaQuery, useTheme } from '@mui/material'
import MediaBase from '../MediaBase'
import {
  MediaWithWidthBreakpoint,
  MediaWithWidthProps,
  MediaWithWidthTypeMap,
} from './MediaWithWidthProps'

const MediaWithWidth = React.forwardRef(function MediaWithWidth(props: MediaWithWidthProps, ref) {
  const { breakpoints, ...other } = props

  const theme = useTheme()
  if (!breakpoints) {
    return null
  }

  const keys = [...theme.breakpoints.keys].reverse()
  const src = keys.reduce(
    (output: MediaWithWidthBreakpoint | null | undefined, key: Breakpoint) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key))
      return !output && matches ? breakpoints[key] : output
    },
    null,
  )

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

  return <MediaBase ref={ref} {...other} {...componentProps} />
}) as OverridableComponent<MediaWithWidthTypeMap>

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
