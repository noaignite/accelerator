import * as React from 'react'
import PropTypes from 'prop-types'
import { chainPropTypes } from '@material-ui/utils'
import { styled } from '@material-ui/system'
import { useThemeProps } from '@material-ui/core'

const MediaBaseRoot = styled('img', {
  name: 'OuiMediaBase',
  slot: 'Root',
})(({ ownerState }) => ({
  display: 'block',
  width: '100%',
  ...(ownerState.isMediaComponent && {
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
