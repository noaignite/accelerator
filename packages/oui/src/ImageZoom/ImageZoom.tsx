import * as React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { OverridableComponent } from '@mui/types'
import { chainPropTypes } from '@mui/utils'
import { useForkRef } from '@mui/material/utils'
import { ClickAwayListener, Fade, styled, useThemeProps } from '@mui/material'
import { clamp, mapRange } from '@noaignite/utils'
import { useLatest } from '../utils'
import classes from './imageZoomClasses'
import { ImageZoomProps, ImageZoomTypeMap } from './ImageZoomProps'

const ImageZoomRoot = styled('div', {
  name: 'OuiImageZoom',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: ImageZoomProps }>({
  position: 'relative',
  display: 'block',
  overflow: 'hidden',
})

const ImageZoomDetails = styled('div', {
  name: 'OuiImageZoom',
  slot: 'Details',
  overridesResolver: (props, styles) => styles.details,
})<{ ownerState: ImageZoomProps }>(({ ownerState }) => ({
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate3d(-50%, -50%, 0)',
  ...(ownerState.magnitute && {
    width: `${100 * ownerState.magnitute}%`,
    height: `${100 * ownerState.magnitute}%`,
  }),
  '& > *:not(style)': {
    width: '100%',
    height: '100%',
  },
}))

const ImageZoom = React.forwardRef(function ImageZoom(inProps: ImageZoomProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'OuiImageZoom' })
  const {
    children,
    className,
    component,
    magnitute = 2,
    onZoomIn,
    onZoomOut,
    TransitionComponent = Fade,
    TransitionProps,
    ...other
  } = props

  const storedOnZoomIn = useLatest(onZoomIn)
  const storedOnZoomOut = useLatest(onZoomOut)

  const rootRef = React.useRef<HTMLDivElement>(null)
  const handleRef = useForkRef(rootRef, ref)
  const detailsRef = React.useRef<HTMLDivElement>(null)

  const [open, setOpen] = React.useState(false)

  const [preview, details] = React.Children.toArray(children)

  const zoomIn = React.useCallback(() => {
    setOpen(true)
    storedOnZoomIn.current?.()
  }, [storedOnZoomIn])

  const zoomOut = React.useCallback(() => {
    setOpen(false)
    storedOnZoomOut.current?.()
  }, [storedOnZoomOut])

  const handleClickAway = React.useCallback(() => {
    zoomOut()
  }, [zoomOut])

  React.useEffect(() => {
    const isTouch = window.matchMedia('(hover: none)').matches
    const rootEl = rootRef.current

    if (!rootEl) {
      return undefined
    }

    let rect = rootEl.getBoundingClientRect()
    let cancelScroll = false

    const firstPosition = { x: rect.width / 2, y: rect.height / 2 }
    const lastPosition = { x: rect.width / 2, y: rect.height / 2 }
    const currentPosition = { x: rect.width / 2, y: rect.height / 2 }

    const syncRect = () => {
      rect = rootEl.getBoundingClientRect()
    }

    const getRectMousePosition = (event: MouseEvent | TouchEvent) => {
      const { pageX, pageY } = event instanceof TouchEvent ? event.changedTouches[0] : event

      const rectX = pageX - window.scrollX - rect.left
      const rectY = pageY - window.scrollY - rect.top

      return [rectX, rectY]
    }

    const handleDocumentTouchMove = (event: TouchEvent) => {
      if (cancelScroll) {
        event.preventDefault()
      }
    }

    const handleClick = () => {
      ;[zoomIn, zoomOut][+open]()
    }

    const handleMouseEnter = () => {
      zoomIn()
    }

    const handleMouseLeave = () => {
      zoomOut()
    }

    const handleTouchStart = (event: TouchEvent) => {
      const [rectX, rectY] = getRectMousePosition(event)
      firstPosition.x = rectX
      firstPosition.y = rectY

      cancelScroll = true
    }

    const handleTouchEnd = () => {
      lastPosition.x = currentPosition.x
      lastPosition.y = currentPosition.y

      cancelScroll = false
    }

    const handleMove = (event: MouseEvent | TouchEvent) => {
      const [rectX, rectY] = getRectMousePosition(event)

      const deltaX = (firstPosition.x - rectX) * -1
      const deltaY = (firstPosition.y - rectY) * -1

      currentPosition.x = clamp(isTouch ? lastPosition.x + deltaX : rectX, 0, rect.width)
      currentPosition.y = clamp(isTouch ? lastPosition.y + deltaY : rectY, 0, rect.height)

      const direction = isTouch ? -1 : 1
      const coordinateX = mapRange(currentPosition.x, 0, rect.width, -1, 1) * direction
      const coordinateY = mapRange(currentPosition.y, 0, rect.height, -1, 1) * direction

      const maxMovement = ((1 / magnitute) * (magnitute - 1)) / 2
      const x = (0.5 + coordinateX * maxMovement) * -100
      const y = (0.5 + coordinateY * maxMovement) * -100

      if (detailsRef.current) {
        detailsRef.current.style.transform = `translate3d(${x}%, ${y}%, 0)`
      }
    }

    const addEventListeners = () => {
      if (isTouch) {
        rootEl.addEventListener('click', handleClick)
      } else {
        rootEl.addEventListener('mouseenter', handleMouseEnter)
        rootEl.addEventListener('mouseleave', handleMouseLeave)
      }

      if (open) {
        window.addEventListener('resize', syncRect)
        window.addEventListener('scroll', syncRect, { passive: true })
        if (isTouch) {
          document.addEventListener('touchmove', handleDocumentTouchMove, { passive: false })
          rootEl.addEventListener('touchmove', handleMove)
          rootEl.addEventListener('touchstart', handleTouchStart)
          rootEl.addEventListener('touchend', handleTouchEnd)
        } else {
          rootEl.addEventListener('mousemove', handleMove)
        }
      }
    }

    const removeEventListeners = () => {
      if (isTouch) {
        rootEl.removeEventListener('click', handleClick)
      } else {
        rootEl.removeEventListener('mouseenter', handleMouseEnter)
        rootEl.removeEventListener('mouseleave', handleMouseLeave)
      }

      if (open) {
        window.removeEventListener('resize', syncRect)
        window.removeEventListener('scroll', syncRect)
        if (isTouch) {
          document.removeEventListener('touchmove', handleDocumentTouchMove)
          rootEl.removeEventListener('touchmove', handleMove)
          rootEl.removeEventListener('touchstart', handleTouchStart)
          rootEl.removeEventListener('touchend', handleTouchEnd)
        } else {
          rootEl.removeEventListener('mousemove', handleMove)
        }
      }
    }

    addEventListeners()
    return () => {
      removeEventListeners()
    }
  }, [magnitute, open, zoomIn, zoomOut])

  const ownerState = {
    ...props,
    open,
    magnitute,
  }

  return (
    <ClickAwayListener
      onClickAway={handleClickAway}
      mouseEvent={false}
      touchEvent={open ? 'onTouchEnd' : false}
    >
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
}) as OverridableComponent<ImageZoomTypeMap>

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
  onZoomIn: PropTypes.func,
  onZoomOut: PropTypes.func,
  TransitionProps: PropTypes.object,
}

export default ImageZoom
