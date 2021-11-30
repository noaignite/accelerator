import * as React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { chainPropTypes } from '@mui/utils'
import { useForkRef } from '@mui/material/utils'
import { styled } from '@mui/system'
import { useThemeProps } from '@mui/material'
import { normalize } from '@noaignite/utils'
import classes from './imageZoomClasses'

const ImageZoomRoot = styled('div', {
  name: 'OuiImageZoom',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({
  display: 'block',
  position: 'relative',
  overflow: 'hidden',
})

const ImageZoomDetails = styled('div', {
  name: 'ImageZoom',
  slot: 'Details',
  overridesResolver: (props, styles) => styles.details,
})(({ theme, ownerState }) => ({
  position: 'absolute',
  left: '50%',
  top: '50%',
  width: `${100 * ownerState.magnitute}%`,
  height: `${100 * ownerState.magnitute}%`,
  transform: 'translate3d(-50%, -50%, 0)',
  opacity: 0,
  visibility: 'hidden',
  transition: theme.transitions.create(['opacity', 'visibility'], {
    duration: theme.transitions.duration.shortest,
  }),
  '& > *:not(style)': {
    width: '100%',
    height: '100%',
  },
  [`.${classes.root}:hover &`]: {
    opacity: 1,
    visibility: 'visible',
  },
}))

const ImageZoom = React.forwardRef(function ImageZoom(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'OuiImageZoom' })
  const { children, className, component = 'div', magnitute = 2, ...other } = props

  const rootRef = React.useRef(null)
  const handleRef = useForkRef(rootRef, ref)
  const detailsRef = React.useRef(null)

  const [reveal, setReveal] = React.useState(false)

  const [preview, details] = React.Children.toArray(children)

  React.useEffect(() => {
    const target = rootRef.current
    let rect = target.getBoundingClientRect()

    const handleMouseEnter = () => {
      rect = target.getBoundingClientRect()

      const isTouch = window.matchMedia('(hover: none)').matches
      setReveal(!isTouch)
    }

    const handleMouseMove = (event) => {
      const mouseX = event.clientX - rect.left
      const mouseY = event.clientY - rect.top

      const coordinateX = (normalize(mouseX, 0, rect.width) - 0.5) * 2
      const coordinateY = (normalize(mouseY, 0, rect.height) - 0.5) * 2

      const imageOverflow = ((1 / magnitute) * (magnitute - 1)) / 2
      const x = (0.5 + imageOverflow * coordinateX) * -100
      const y = (0.5 + imageOverflow * coordinateY) * -100

      detailsRef.current.style.transform = `translate3d(${x}%, ${y}%, 0)`
    }

    target.addEventListener('mouseenter', handleMouseEnter)
    target.addEventListener('mousemove', handleMouseMove)
    return () => {
      target.removeEventListener('mouseenter', handleMouseEnter)
      target.removeEventListener('mousemove', handleMouseMove)
    }
  }, [magnitute])

  const ownerState = {
    magnitute,
  }

  return (
    <ImageZoomRoot
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      as={component}
      ref={handleRef}
      {...other}
    >
      {preview}

      {reveal && (
        <ImageZoomDetails className={classes.details} ownerState={ownerState} ref={detailsRef}>
          {details}
        </ImageZoomDetails>
      )}
    </ImageZoomRoot>
  )
})

ImageZoom.propTypes = {
  children: chainPropTypes(PropTypes.node.isRequired, (props) => {
    const [preview, details] = React.Children.toArray(props.children)
    if (!React.isValidElement(preview) || !React.isValidElement(details)) {
      return new Error('OUI: Expected two valid elements as children.')
    }

    return null
  }),
  className: PropTypes.string,
  component: PropTypes.elementType,
  magnitute: PropTypes.number,
}

export default ImageZoom
