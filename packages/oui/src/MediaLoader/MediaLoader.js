// @inheritedComponent AspectRatio

import * as React from 'react'
import PropTypes from 'prop-types'
import classnames from 'clsx'
import mediaLoaded from '@maeertin/medialoaded'
import { InView } from 'react-intersection-observer'
import { elementAcceptingRef } from '@material-ui/utils'
import { useControlled } from '@material-ui/core/utils'
import withStyles from '@material-ui/styles/withStyles'
import Fade from '@material-ui/core/Fade'
import AspectRatio from '../AspectRatio'

export const styles = {
  root: {},
  bounds: {
    position: 'absolute',
    zIndex: -1,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  placeholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    // ⚠️ object-fit is not supported by IE 11.
    objectFit: 'cover',
  },
}

const MediaLoader = React.forwardRef(function MediaLoader(props, ref) {
  const {
    children: childrenProp,
    classes,
    className,
    lazy,
    /**
     * `lazyRootMargin` default based on Chromium 4G load-in distance threshold
     * https://web.dev/native-lazy-loading/#load-in-distance-threshold
     * https://source.chromium.org/chromium/chromium/src/+/master:third_party/blink/renderer/core/frame/settings.json5;drc=e8f3cf0bbe085fee0d1b468e84395aad3ebb2cad;l=971-1003?originalUrl=https:%2F%2Fcs.chromium.org%2Fchromium%2Fsrc%2Fthird_party%2Fblink%2Frenderer%2Fcore%2Fframe%2Fsettings.json5
     */
    lazyRootMargin = '3000px 0px',
    onEnter,
    onEntered,
    onEntering,
    onLoaded,
    placeholder: placeholderProp,
    reveal: revealProp,
    revealRootMargin,
    TransitionComponent = Fade,
    transitionDuration = 750,
    TransitionProps,
    ...other
  } = props

  const mediaRef = React.useRef(null)

  const [shouldRender, setShouldRender] = React.useState(!lazy)
  const [loaded, setLoaded] = React.useState(false)

  const [shouldReveal, setShouldReveal] = useControlled({
    controlled: revealProp,
    default: !revealRootMargin,
    name: 'MediaLoader',
    state: 'reveal',
  })

  // There is no point in transitioning in an unloaded image.
  const reveal = loaded && shouldReveal

  const handleRenderIntersectionChange = React.useCallback((inView) => {
    if (inView) {
      setShouldRender(true)
    }
  }, [])

  const handleRevealIntersectionChange = React.useCallback(
    (inView) => {
      if (inView) {
        setShouldReveal(true)
      }
    },
    [setShouldReveal],
  )

  const handleLoaded = React.useCallback(
    (instance) => {
      if (mediaRef.current) {
        setLoaded(true)

        if (onLoaded) {
          onLoaded(instance)
        }
      }
    },
    [onLoaded],
  )

  const handleMediaRef = React.useCallback(
    (node) => {
      mediaRef.current = node

      if (node) {
        mediaLoaded(node, handleLoaded)
      }
    },
    [handleLoaded],
  )

  // Invert callback direction to simulate `children` still being transitioned.
  const handleExit = React.useCallback(() => {
    if (onEnter) {
      onEnter(mediaRef.current)
    }
  }, [onEnter])

  // Invert callback direction to simulate `children` still being transitioned.
  const handleExited = React.useCallback(() => {
    if (onEntered) {
      onEntered(mediaRef.current)
    }
  }, [onEntered])

  // Invert callback direction to simulate `children` still being transitioned.
  const handleExiting = React.useCallback(() => {
    if (onEntering) {
      onEntering(mediaRef.current)
    }
  }, [onEntering])

  let placeholder = null
  if (placeholderProp && React.isValidElement(placeholderProp)) {
    placeholder = (
      <TransitionComponent
        className={classnames(classes.placeholder, placeholderProp.props.className)}
        in={!reveal}
        onExit={handleExit}
        onExited={handleExited}
        onExiting={handleExiting}
        timeout={transitionDuration}
        appear={false} // Don't transition `placeholder` on mount.
        unmountOnExit
        {...TransitionProps}
      >
        {placeholderProp}
      </TransitionComponent>
    )
  }

  let children = null
  if (childrenProp && React.isValidElement(childrenProp)) {
    children = React.cloneElement(childrenProp, { ref: handleMediaRef })

    if (!placeholder) {
      children = (
        <TransitionComponent
          in={reveal}
          onEnter={onEnter}
          onEntered={onEntered}
          onEntering={onEntering}
          timeout={transitionDuration}
          {...TransitionProps}
        >
          {children}
        </TransitionComponent>
      )
    }
  }

  return (
    <AspectRatio className={classnames(classes.root, className)} ref={ref} {...other}>
      {!shouldRender && (
        <InView
          className={classes.bounds}
          onChange={handleRenderIntersectionChange}
          rootMargin={lazyRootMargin}
          triggerOnce
        />
      )}
      {!shouldReveal && (
        <InView
          className={classes.bounds}
          onChange={handleRevealIntersectionChange}
          rootMargin={revealRootMargin}
          triggerOnce
        />
      )}

      {shouldRender && children}
      {placeholder}
    </AspectRatio>
  )
})

MediaLoader.propTypes = {
  children: elementAcceptingRef.isRequired,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  lazy: PropTypes.bool,
  lazyRootMargin: PropTypes.string,
  onEnter: PropTypes.func,
  onEntered: PropTypes.func,
  onEntering: PropTypes.func,
  onLoaded: PropTypes.func,
  placeholder: PropTypes.element,
  reveal: PropTypes.bool,
  revealRootMargin: PropTypes.string,
  TransitionComponent: PropTypes.elementType,
  transitionDuration: PropTypes.number,
  TransitionProps: PropTypes.object,
}

MediaLoader.uiName = 'OuiMediaLoader'

export default withStyles(styles, { name: 'OuiMediaLoader' })(MediaLoader)
