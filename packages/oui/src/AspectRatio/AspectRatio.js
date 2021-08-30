import * as React from 'react'
import PropTypes from 'prop-types'
import { styled } from '@material-ui/system'
import { useThemeProps } from '@material-ui/core'

const AspectRatioRoot = styled('div', {
  name: 'OuiAspectRatio',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({
  display: 'block',
  position: 'relative',
  width: '100%',
  '&:before': {
    content: '""',
    display: 'block',
    paddingBottom: 'calc(100% / var(--aspect-ratio))',
  },
  '& > *': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  '& > video, & > picture, & > img': {
    objectFit: 'cover',
  },
})

const AspectRatio = React.forwardRef(function AspectRatio(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'OuiAspectRatio' })
  const { children, component = 'div', height, ratio: ratioProp, style, width, ...other } = props

  const ratio = width && height ? width / height : ratioProp
  const composedStyle = typeof ratio === 'number' ? { '--aspect-ratio': ratio, ...style } : style

  return (
    <AspectRatioRoot as={component} style={composedStyle} ref={ref} {...other}>
      {children}
    </AspectRatioRoot>
  )
})

AspectRatio.propTypes = {
  children: PropTypes.node,
  component: PropTypes.elementType,
  height: PropTypes.number,
  ratio: PropTypes.number,
  style: PropTypes.object,
  width: PropTypes.number,
}

export default AspectRatio
