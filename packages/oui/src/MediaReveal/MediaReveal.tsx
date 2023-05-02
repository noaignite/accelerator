import * as React from 'react'
import PropTypes from 'prop-types'
import { MLEntry } from '@maeertin/medialoaded'
import { OverridableComponent } from '@mui/types'
import clsx from 'clsx'
import { useForkRef } from '@mui/material/utils'
import { Fade, styled, useThemeProps } from '@mui/material'
import InView from '../InView'
import MediaLoader from '../MediaLoader'
import classes from './mediaRevealClasses'
import { MediaRevealProps, MediaRevealTypeMap } from './MediaRevealProps'

const MediaRevealRoot = styled(MediaLoader)({
  position: 'relative',
})

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
    className,
    onEnter,
    onLoaded,
    rootMargin,
    TransitionComponent = Fade,
    transitionDuration = 750,
    TransitionProps,
    ...other
  } = props

  const rootRef = React.useRef<HTMLDivElement>(null)
  const handleRef = useForkRef(rootRef, ref)

  const [inView, setInView] = React.useState(!rootMargin)
  const [loaded, setLoaded] = React.useState(false)

  const reveal = inView && loaded
  const isPlainChildren = typeof children !== 'function'

  const handleLoaded = React.useCallback(
    (instance: MLEntry) => {
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
    (entry: IntersectionObserverEntry) => {
      setInView(true)

      if (onEnter) {
        onEnter(entry)
      }
    },
    [onEnter],
  )

  return (
    <MediaRevealRoot
      className={clsx(classes.root, className)}
      onLoaded={handleLoaded}
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
}) as OverridableComponent<MediaRevealTypeMap>

MediaReveal.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  className: PropTypes.string,
  onEnter: PropTypes.func,
  onLoaded: PropTypes.func,
  rootMargin: PropTypes.string,
  TransitionComponent: PropTypes.elementType,
  transitionDuration: PropTypes.number,
  TransitionProps: PropTypes.object,
}

export default MediaReveal
