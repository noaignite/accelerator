import * as React from 'react'
import PropTypes from 'prop-types'
import { chainPropTypes } from '@mui/utils'
import { styled } from '@mui/system'
import { useThemeProps } from '@mui/material'

const MediaBaseRoot = styled('img', {
  name: 'OuiMediaBase',
  slot: 'Root',
  overridesResolver: (props, styles) => {
    const { ownerState } = props

    return [
      styles.root,
      ownerState.isMediaComponent && styles.media,
      ownerState.isPictureComponent && styles.picture,
    ]
  },
})(({ ownerState }) => ({
  display: 'block',
  width: '100%',
  ...(ownerState.isMediaComponent && {
    height: 'auto',
    objectFit: 'cover',
  }),
  ...(ownerState.isPictureComponent && {
    '& img': {
      display: 'inherit',
      width: 'inherit',
      height: 'inherit',
      objectFit: 'inherit',
    },
  }),
}))

const MediaBase = React.forwardRef(function MediaBase(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'OuiMediaBase' })
  const { children, component = 'img', lazy, placeholder, src, ...other } = props

  const ownerState = {
    isMediaComponent: ['video', 'picture', 'img'].includes(component),
    isPictureComponent: ['picture'].includes(component),
  }

  return (
    <MediaBaseRoot
      as={component}
      ownerState={ownerState}
      src={lazy ? placeholder : src}
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
  lazy: PropTypes.bool,
  placeholder: PropTypes.string,
  src: PropTypes.string,
}

export default MediaBase
