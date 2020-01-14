// @inheritedComponent AspectRatio

import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'clsx'
import mediaLoaded from '@maeertin/medialoaded'
import { InView } from 'react-intersection-observer'
import withStyles from '@material-ui/styles/withStyles'
import Fade from '@material-ui/core/Fade'
import { elementAcceptingRef } from '@oakwood/oui-utils'
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
  media: {},
}

const MediaLoader = React.forwardRef(function MediaLoader(props, ref) {
  const {
    children,
    classes,
    className,
    component = 'div',
    height,
    lazy,
    onLoad,
    onRender,
    onReveal,
    placeholder,
    rootMargin,
    TransitionComponent = Fade,
    transitionDuration = 1000,
    TransitionProps,
    width,
    ...other
  } = props

  const [shouldRender, setShouldRender] = React.useState(!lazy)
  const [shouldReveal, setShouldReveal] = React.useState(!rootMargin)
  const [loaded, setLoaded] = React.useState(false)

  const handleRender = React.useCallback(
    (inView, entry) => {
      if (inView) {
        setShouldRender(inView)

        if (onRender) {
          onRender(entry)
        }
      }
    },
    [onRender],
  )

  const handleReveal = React.useCallback(
    (inView, entry) => {
      if (inView) {
        setShouldReveal(inView)

        if (onReveal) {
          onReveal(entry)
        }
      }
    },
    [onReveal],
  )

  const handleLoad = React.useCallback(
    instance => {
      setLoaded(true)

      if (onLoad) {
        onLoad(instance)
      }
    },
    [onLoad],
  )

  const handleMediaRef = node => {
    if (node && !loaded) {
      mediaLoaded(node, handleLoad)
    }
  }

  const inProp = shouldReveal && loaded

  return (
    <AspectRatio
      className={classnames(classes.root, className)}
      component={component}
      height={height}
      width={width}
      ref={ref}
      {...other}
    >
      {!shouldRender && (
        <InView className={classes.bounds} onChange={handleRender} rootMargin="2000px 0px" />
      )}
      {!shouldReveal && (
        <InView className={classes.bounds} onChange={handleReveal} rootMargin={rootMargin} />
      )}

      {shouldRender && (
        <TransitionComponent
          in={inProp}
          className={classnames(classes.media, children.props.className)}
          timeout={transitionDuration}
          ref={handleMediaRef}
          {...TransitionProps}
        >
          {children}
        </TransitionComponent>
      )}

      {placeholder && (
        <Fade
          in={!inProp}
          className={classnames(classes.bounds, placeholder.props.className)}
          timeout={transitionDuration * 2}
          unmountOnExit
        >
          {placeholder}
        </Fade>
      )}
    </AspectRatio>
  )
})

MediaLoader.propTypes = {
  children: elementAcceptingRef.isRequired,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  component: PropTypes.elementType,
  height: PropTypes.number,
  lazy: PropTypes.bool,
  onLoad: PropTypes.func,
  onRender: PropTypes.func,
  onReveal: PropTypes.func,
  placeholder: PropTypes.element,
  rootMargin: PropTypes.string,
  TransitionComponent: PropTypes.elementType,
  transitionDuration: PropTypes.number,
  TransitionProps: PropTypes.object,
  width: PropTypes.number,
}

MediaLoader.uiName = 'OuiMediaLoader'

export default withStyles(styles, { name: 'OuiMediaLoader' })(MediaLoader)
