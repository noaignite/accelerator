// @inheritedComponent MediaLoader

import * as React from 'react'
import PropTypes from 'prop-types'
import { useForkRef } from '@mui/material/utils'
import { styled } from '@mui/system'
import { Fade, useThemeProps } from '@mui/material'
import InView from '../InView'
import MediaLoader from '../MediaLoader'
import classes from './mediaRevealClasses'

const MediaRevealRoot = styled(MediaLoader, {
  name: 'OuiMediaReveal',
  slot: 'Root',
  overridesResolver: (props, styles) => {
    const { ownerState } = props

    return [styles.root, ownerState.ratio && styles.ratio]
  },
})(({ ownerState }) => ({
  display: 'block',
  position: 'relative',
  width: '100%',
  ...(ownerState.ratio && {
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
  }),
}))

const MediaRevealBounds = styled(InView, {
  name: 'OuiMediaReveal',
  slot: 'Bounds',
  overridesResolver: (props, styles) => styles.bounds,
})({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
})

const MediaReveal = React.forwardRef(function MediaReveal(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'OuiMediaReveal' })
  const {
    children,
    height,
    onEnter,
    onLoaded,
    ratio: ratioProp,
    rootMargin,
    style,
    TransitionComponent = Fade,
    transitionDuration = 750,
    TransitionProps,
    width,
    ...other
  } = props

  const rootRef = React.useRef(null)
  const handleRef = useForkRef(rootRef, ref)

  const [inView, setInView] = React.useState(!rootMargin)
  const [loaded, setLoaded] = React.useState(false)

  const reveal = inView && loaded
  const isPlainChildren = typeof children !== 'function'

  const ratio = width && height ? width / height : ratioProp
  const composedStyle = ratio ? { '--aspect-ratio': ratio, ...style } : style

  const handleLoaded = React.useCallback(
    (instance) => {
      // Make sure component is still mounted
      if (rootRef.current) {
        setLoaded(true)

        if (onLoaded) {
          onLoaded(instance)
        }
      }
    },
    [onLoaded],
  )

  const handleEnter = React.useCallback(
    (entry) => {
      setInView(true)

      if (onEnter) {
        onEnter(entry)
      }
    },
    [onEnter],
  )

  const ownerState = {
    ratio,
  }

  return (
    <MediaRevealRoot
      ownerState={ownerState}
      onLoaded={handleLoaded}
      style={composedStyle}
      ref={handleRef}
      {...other}
    >
      {rootMargin && !inView && (
        <MediaRevealBounds
          className={classes.bounds}
          onEnter={handleEnter}
          rootMargin={rootMargin}
          triggerOnce
        />
      )}

      {isPlainChildren ? (
        <TransitionComponent in={reveal} timeout={transitionDuration} {...TransitionProps}>
          {children}
        </TransitionComponent>
      ) : (
        children({ inView, loaded, reveal })
      )}
    </MediaRevealRoot>
  )
})

MediaReveal.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  height: PropTypes.number,
  onEnter: PropTypes.func,
  onLoaded: PropTypes.func,
  ratio: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  rootMargin: PropTypes.string,
  style: PropTypes.object,
  TransitionComponent: PropTypes.elementType,
  transitionDuration: PropTypes.number,
  TransitionProps: PropTypes.object,
  width: PropTypes.number,
}

export default MediaReveal
