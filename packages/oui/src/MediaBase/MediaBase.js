import * as React from 'react'
import PropTypes from 'prop-types'
import { chainPropTypes } from '@mui/utils'
import { styled } from '@mui/system'
import { useThemeProps } from '@mui/material'

const MediaBaseRoot = styled('img', {
  name: 'OuiMediaBase',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})(({ ownerState }) => ({
  display: 'block',
  width: '100%',
  height: 'auto',
  objectFit: 'cover',
  ...(ownerState.width &&
    ownerState.height && {
      aspectRatio: `${ownerState.width}/${ownerState.height}`,
    }),
  '& > img': {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'inherit',
  },
}))

const MediaBase = React.forwardRef(function MediaBase(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'OuiMediaBase' })
  const { children, component = 'img', height, src, width, ...other } = props

  const ownerState = {
    component,
    height,
    width,
  }

  return (
    <MediaBaseRoot
      as={component}
      ownerState={ownerState}
      width={width}
      height={height}
      src={src}
      ref={ref}
      {...other}
    >
      {children}
    </MediaBaseRoot>
  )
})

MediaBase.propTypes = {
  children: chainPropTypes(PropTypes.node, (props) => {
    if (!props.children && !props.src && !props.component) {
      return new Error('OUI: Either `children`, `src` or `component` prop must be specified.')
    }
    return null
  }),
  component: PropTypes.elementType,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  src: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

export default MediaBase
