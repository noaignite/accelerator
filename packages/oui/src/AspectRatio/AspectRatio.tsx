/* eslint-disable */

import * as React from 'react'
import PropTypes from 'prop-types'
import { OverridableComponent } from '@mui/types'
import { styled, useThemeProps } from '@mui/material'
import { AspectRatioProps, AspectRatioTypeMap } from './AspectRatioProps'

const AspectRatioRoot = styled('div', {
  name: 'OuiAspectRatio',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: AspectRatioProps }>(({ ownerState }) => ({
  '--aspect-ratio': ownerState.ratio,
  display: 'block',
  position: 'relative',
  width: '100%',
  ...(ownerState.ratio && {
    '&:before': {
      content: '""',
      display: 'block',
      paddingBottom: 'calc(100% / var(--aspect-ratio))',
    },
    '& > :not(style)': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    '& > video, & > picture, & > img': {
      objectFit: 'cover',
    },
  }),
}))

const AspectRatio = React.forwardRef(function AspectRatio(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'OuiAspectRatio',
  })

  const { children, component = 'div', height, ratio: ratioProp, width, ...other } = props

  let ratio = ratioProp
  if (width && height) {
    ratio = +width / +height
  }

  const ownerState = {
    ratio,
  }

  return (
    <AspectRatioRoot ownerState={ownerState} as={component} ref={ref} {...other}>
      {children}
    </AspectRatioRoot>
  )
}) as OverridableComponent<AspectRatioTypeMap>

AspectRatio.propTypes = {
  children: PropTypes.node,
  component: PropTypes.elementType,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ratio: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

export default AspectRatio
