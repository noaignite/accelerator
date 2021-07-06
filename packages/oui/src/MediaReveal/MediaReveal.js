// @inheritedComponent MediaLoader

import * as React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { useForkRef } from '@material-ui/core/utils'
import withStyles from '@material-ui/styles/withStyles'
import Fade from '@material-ui/core/Fade'
import { styles as aspectRatioStyles } from '../AspectRatio/AspectRatio'
import InView from '../InView'
import MediaLoader from '../MediaLoader'

export const styles = {
  ...aspectRatioStyles,
  bounds: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
}

const MediaReveal = React.forwardRef(function MediaReveal(props, ref) {
  const {
    children,
    classes,
    className,
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
  const composedStyle = typeof ratio === 'number' ? { '--aspect-ratio': ratio, ...style } : style

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

  return (
    <MediaLoader
      className={clsx(
        classes.root,
        {
          [classes.ratio]: ratio,
        },
        className,
      )}
      onLoaded={handleLoaded}
      style={composedStyle}
      ref={handleRef}
      {...other}
    >
      {rootMargin && !inView && (
        <InView
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
    </MediaLoader>
  )
})

MediaReveal.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  classes: PropTypes.object,
  className: PropTypes.string,
  height: PropTypes.number,
  onEnter: PropTypes.func,
  onLoaded: PropTypes.func,
  ratio: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  rootMargin: PropTypes.string,
  style: PropTypes.object,
  TransitionComponent: PropTypes.elementType,
  transitionDuration: PropTypes.number,
  TransitionProps: PropTypes.object,
  width: PropTypes.number,
}

export default withStyles(styles, { name: 'OuiMediaReveal' })(MediaReveal)
