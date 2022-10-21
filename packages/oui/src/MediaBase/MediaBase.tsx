import * as React from 'react'
import PropTypes from 'prop-types'
import { OverridableComponent } from '@mui/types'
import { chainPropTypes } from '@mui/utils'
import { styled } from '@mui/system'
import { useThemeProps } from '@mui/material'
import { MediaBaseProps, MediaBaseTypeMap } from './MediaBaseProps'

const MEDIA_COMPONENTS = ['audio', 'iframe', 'img', 'picture', 'video']
const IMAGE_COMPONENTS = ['img', 'picture']

const MediaBaseRoot = styled('img', {
  name: 'OuiMediaBase',
  slot: 'Root',
  overridesResolver: (props, styles) => {
    const { ownerState } = props

    return [
      styles.root,
      MEDIA_COMPONENTS.includes(ownerState.component) && styles.media,
      IMAGE_COMPONENTS.includes(ownerState.component) && styles.image,
      ownerState.component === 'video' && styles.video,
    ]
  },
})<{ ownerState: MediaBaseProps }>(({ ownerState }) => {
  const { component } = ownerState

  const isMediaComponent = typeof component === 'string' && MEDIA_COMPONENTS.includes(component)
  const isImageComponent = typeof component === 'string' && IMAGE_COMPONENTS.includes(component)
  const isVideoComponent = component === 'video'

  return {
    display: 'block',
    ...(isMediaComponent && {
      width: '100%',
      height: 'auto',
    }),
    ...((isImageComponent || isVideoComponent) && {
      objectFit: 'cover',
    }),
    '& > img': {
      display: 'inherit',
      width: '100%',
      height: 'inherit',
      objectFit: 'inherit',
    },
  }
})

const MediaBase = React.forwardRef(function MediaBase(inProps: MediaBaseProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'OuiMediaBase' })
  const { children, component = 'img', src, ...other } = props

  const ownerState = {
    ...props,
    component,
  }

  return (
    <MediaBaseRoot as={component} ownerState={ownerState} src={src} ref={ref} {...other}>
      {children}
    </MediaBaseRoot>
  )
}) as OverridableComponent<MediaBaseTypeMap>

MediaBase.propTypes = {
  children: chainPropTypes(PropTypes.node, (props) => {
    if (!props.children && !props.src && !props.component) {
      return new Error('OUI: Either `children`, `src` or `component` prop must be specified.')
    }
    return null
  }),
  component: PropTypes.elementType,
  src: PropTypes.string,
}

export default MediaBase
