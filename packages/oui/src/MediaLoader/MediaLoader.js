// @inheritedComponent AspectRatio

import * as React from 'react'
import PropTypes from 'prop-types'
import classnames from 'clsx'
import mediaLoaded from '@maeertin/medialoaded'
import { InView } from 'react-intersection-observer'
import { elementAcceptingRef } from '@material-ui/utils'
import { useControlled, useForkRef } from '@material-ui/core/utils'
import withStyles from '@material-ui/styles/withStyles'
import Fade from '@material-ui/core/Fade'
import AspectRatio from '../AspectRatio'

export const styles = {
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
    onLoaded,
    placeholder: placeholderProp,
    in: inProp,
    rootMargin,
    TransitionComponent = Fade,
    transitionDuration = 750,
    TransitionProps,
    ...other
  } = props

  const mediaRef = React.useRef(null)

  const [loaded, setLoaded] = React.useState(false)
  const [inState, setInState] = useControlled({
    controlled: inProp,
    default: !rootMargin,
    name: 'MediaLoader',
  })

  // Pointless to transition in a not loaded image.
  const reveal = loaded && inState

  const handleIntersectionChange = React.useCallback(
    (inView) => {
      if (inView) {
        setInState(true)
      }
    },
    [setInState],
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

  const handleOwnMediaRef = React.useCallback(
    (node) => {
      mediaRef.current = node
      if (node) {
        mediaLoaded(node, handleLoaded)
      }
    },
    [handleLoaded],
  )
  const handleMediaRef = useForkRef(handleOwnMediaRef, childrenProp?.ref)

  let placeholder = null
  if (placeholderProp && React.isValidElement(placeholderProp)) {
    placeholder = (
      <TransitionComponent
        className={classnames(classes.placeholder, placeholderProp.props.className)}
        in={!reveal}
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
        <TransitionComponent in={reveal} timeout={transitionDuration} {...TransitionProps}>
          {children}
        </TransitionComponent>
      )
    }
  }

  const componentProps = { ...other }
  const Component = AspectRatio

  let ContainerComponent = null
  if (rootMargin) {
    componentProps.onChange = handleIntersectionChange
    componentProps.rootMargin = rootMargin
    componentProps.triggerOnce = true
    ContainerComponent = InView
  }

  if (ContainerComponent) {
    return (
      <ContainerComponent as={Component} ref={ref} {...componentProps}>
        {children}
        {placeholder}
      </ContainerComponent>
    )
  }

  return (
    <Component ref={ref} {...componentProps}>
      {children}
      {placeholder}
    </Component>
  )
})

MediaLoader.propTypes = {
  children: elementAcceptingRef.isRequired,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  in: PropTypes.bool,
  onLoaded: PropTypes.func,
  placeholder: PropTypes.element,
  rootMargin: PropTypes.string,
  TransitionComponent: PropTypes.elementType,
  transitionDuration: PropTypes.number,
  TransitionProps: PropTypes.object,
}

export default withStyles(styles, { name: 'OuiMediaLoader' })(MediaLoader)
