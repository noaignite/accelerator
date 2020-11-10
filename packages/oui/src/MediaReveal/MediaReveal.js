// @inheritedComponent MediaLoader

import * as React from 'react'
import PropTypes from 'prop-types'
import classnames from 'clsx'
import { useForkRef } from '@material-ui/core/utils'
import withStyles from '@material-ui/styles/withStyles'
import Fade from '@material-ui/core/Fade'
import { calculateRatio, styles as aspectRatioStyles } from '../AspectRatio/AspectRatio'
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
    rootMargin,
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
      className={classnames(classes.root, className)}
      onLoaded={handleLoaded}
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

      {height && width && (
        <div
          className={classes.ratio}
          style={{ paddingBottom: `${calculateRatio(width, height)}%` }}
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
  rootMargin: PropTypes.string,
  TransitionComponent: PropTypes.elementType,
  transitionDuration: PropTypes.number,
  TransitionProps: PropTypes.object,
  width: PropTypes.number,
}

export default withStyles(styles, { name: 'OuiMediaReveal' })(MediaReveal)
