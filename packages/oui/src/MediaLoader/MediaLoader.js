import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'clsx'
import imagesLoaded from 'imagesloaded'
import { InView } from 'react-intersection-observer'
import withStyles from '@material-ui/core/styles/withStyles'
import Fade from '@material-ui/core/Fade'
import useForkRef from '@oakwood/oui-utils/useForkRef'

export const styles = theme => ({
  root: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
  },
  loading: {},
  unloaded: {},
  aspectRatioFill: {
    paddingBottom: ({ aspectRatio }) => {
      if (aspectRatio) {
        const { width = 1, height = 1 } = aspectRatio
        return `${((height / width) * 100).toFixed(2)}%`
      }
      return undefined
    },
    '& + *': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
  },
  placeholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.background.media || '#eee',
    objectFit: 'cover',
  },
})

const MediaLoader = React.forwardRef(function MediaLoader(props, ref) {
  const {
    aspectRatio,
    children: childrenProp,
    classes,
    className: classNameProp,
    component = 'div',
    disablePlaceholder,
    lazy,
    onIntersect,
    onReady,
    placeholder: placeholderProp = <div />,
    rootMargin = '2000px 0px',
    TransitionComponent = Fade,
    transitionDuration = 1000,
    TransitionProps,
    ...other
  } = props

  const [shouldRender, setShouldRender] = React.useState(!lazy)
  const [loaded, setLoaded] = React.useState(false)

  const handleIntersect = (inView, entry) => {
    setShouldRender(inView)

    if (onIntersect) {
      onIntersect(inView, entry)
    }
  }

  const handleMediaReady = instance => {
    setLoaded(true)

    if (onReady) {
      onReady(instance)
    }
  }

  const handleMediaRef = node => {
    if (node && !loaded) {
      imagesLoaded(node, handleMediaReady)
    }
  }

  let Component = component
  if (lazy) {
    Component = InView
  }

  let componentProps = {}
  if (Component === InView) {
    componentProps = {
      as: component,
      onChange: handleIntersect,
      triggerOnce: true,
      rootMargin,
    }
  }

  const handleMediaForkRef = useForkRef(handleMediaRef, childrenProp.ref)

  let children = shouldRender ? childrenProp : null
  if (React.isValidElement(children)) {
    children = React.cloneElement(children, {
      className: classnames(classes.media, children.props.className),
      ref: handleMediaForkRef,
    })
  }

  let placeholder = !disablePlaceholder ? placeholderProp : null
  if (React.isValidElement(placeholder)) {
    placeholder = (
      <TransitionComponent
        appear={false} // We're only transitioning out.
        in={!loaded}
        timeout={transitionDuration}
        unmountOnExit
        {...TransitionProps}
      >
        {React.cloneElement(placeholder, {
          className: classnames(classes.placeholder, placeholder.props.className),
        })}
      </TransitionComponent>
    )
  }

  const className = classnames(
    classes.root,
    {
      [classes.loading]: !loaded,
      [classes.unloaded]: !shouldRender,
    },
    classNameProp,
  )

  return (
    <Component className={className} ref={ref} {...componentProps} {...other}>
      {aspectRatio && <div className={classes.aspectRatioFill} />}
      {children}
      {placeholder}
    </Component>
  )
})

MediaLoader.propTypes = {
  aspectRatio: PropTypes.shape({
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
  }),
  children: PropTypes.element.isRequired,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  component: PropTypes.string,
  disablePlaceholder: PropTypes.bool,
  lazy: PropTypes.bool,
  onIntersect: PropTypes.func,
  onReady: PropTypes.func,
  placeholder: PropTypes.element,
  rootMargin: PropTypes.string,
  TransitionComponent: PropTypes.elementType,
  transitionDuration: PropTypes.number,
  TransitionProps: PropTypes.object,
}

MediaLoader.uiName = 'MediaLoader'

export default withStyles(styles)(MediaLoader)
