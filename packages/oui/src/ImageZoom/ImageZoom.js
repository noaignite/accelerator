import * as React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { chainPropTypes } from '@mui/utils'
import { useForkRef } from '@mui/material/utils'
import { styled } from '@mui/system'
import { ClickAwayListener, Fade, useThemeProps } from '@mui/material'
import { mapRange } from '@noaignite/utils'
import classes from './imageZoomClasses'

const ImageZoomRoot = styled('div', {
  name: 'OuiImageZoom',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({
  position: 'relative',
  display: 'block',
  overflow: 'hidden',
})

const ImageZoomDetails = styled('div', {
  name: 'OuiImageZoom',
  slot: 'Details',
  overridesResolver: (props, styles) => styles.details,
})(({ ownerState }) => ({
  position: 'absolute',
  left: '50%',
  top: '50%',
  width: `${100 * ownerState.magnitute}%`,
  height: `${100 * ownerState.magnitute}%`,
  transform: 'translate3d(-50%, -50%, 0)',
  '& > *:not(style)': {
    width: '100%',
    height: '100%',
  },
}))

const ImageZoom = React.forwardRef(function ImageZoom(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'OuiImageZoom' })
  const {
    children,
    className,
    component = 'div',
    magnitute = 2,
    TransitionProps,
    // eslint-disable-next-line react/prop-types
    TransitionComponent = Fade,
    ...other
  } = props

  const rootRef = React.useRef(null)
  const handleRef = useForkRef(rootRef, ref)
  const detailsRef = React.useRef(null)

  const [open, setOpen] = React.useState(false)

  const [preview, details] = React.Children.toArray(children)

  const handleClickAway = React.useCallback(() => {
    setOpen(false)
  }, [])

  React.useEffect(() => {
    const isTouch = window.matchMedia('(hover: none)').matches
    const target = rootRef.current

    let rect = target.getBoundingClientRect()
    let cancelScroll = false

    const preventScroll = (event) => {
      if (cancelScroll) {
        event.preventDefault()
      }
    }

    const syncRect = () => {
      rect = target.getBoundingClientRect()
    }

    const handleMouseEnter = () => {
      setOpen(true)
    }

    const handleMouseLeave = () => {
      setOpen(false)
    }

    const handleClick = () => {
      setOpen((prev) => !prev)
    }

    const handleTouchStart = () => {
      cancelScroll = true
    }

    const handleTouchEnd = () => {
      cancelScroll = false
    }

    const handleMove = (event) => {
      const pageX = event.pageX ?? event.touches?.[0]?.pageX
      const pageY = event.pageY ?? event.touches?.[0]?.pageY

      const rectX = pageX - window.scrollX - rect.left
      const rectY = pageY - window.scrollY - rect.top

      const normalizedRectX = mapRange(rectX, 0, rect.width, 0, 1, true)
      const normalizedRectY = mapRange(rectY, 0, rect.height, 0, 1, true)

      const direction = isTouch ? -1 : 1
      const coordinateX = (normalizedRectX - 0.5) * 2 * direction
      const coordinateY = (normalizedRectY - 0.5) * 2 * direction

      const imageOverflow = ((1 / magnitute) * (magnitute - 1)) / 2
      const x = (0.5 + imageOverflow * coordinateX) * -100
      const y = (0.5 + imageOverflow * coordinateY) * -100

      detailsRef.current.style.transform = `translate3d(${x}%, ${y}%, 0)`
    }

    const registerListeners = (register) => {
      const method = `${register ? 'add' : 'remove'}EventListener`

      if (isTouch) {
        target[method]('click', handleClick)
      } else {
        target[method]('mouseenter', handleMouseEnter)
        target[method]('mouseleave', handleMouseLeave)
      }

      if (open) {
        window[method]('resize', syncRect)
        window[method]('scroll', syncRect, { passive: true })
        if (isTouch) {
          document[method]('touchmove', preventScroll, { passive: false })
          target[method]('touchmove', handleMove)
          target[method]('touchstart', handleTouchStart)
          target[method]('touchend', handleTouchEnd)
        } else {
          target[method]('mousemove', handleMove)
        }
      }
    }

    registerListeners(true)
    return () => {
      registerListeners(false)
    }
  }, [open, magnitute])

  const ownerState = {
    open,
    magnitute,
  }

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <ImageZoomRoot
        className={clsx(classes.root, className)}
        ownerState={ownerState}
        as={component}
        ref={handleRef}
        {...other}
      >
        {preview}

        <TransitionComponent in={open} unmountOnExit {...TransitionProps}>
          <ImageZoomDetails className={classes.details} ownerState={ownerState} ref={detailsRef}>
            {details}
          </ImageZoomDetails>
        </TransitionComponent>
      </ImageZoomRoot>
    </ClickAwayListener>
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
  TransitionProps: PropTypes.object,
}

export default ImageZoom
