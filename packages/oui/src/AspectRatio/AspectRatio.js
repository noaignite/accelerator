import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'clsx'
import withStyles from '@material-ui/core/styles/withStyles'

export const styles = {
  root: {
    display: 'block',
    position: 'relative',
    width: '100%',
  },
  bounds: {
    paddingBottom: ({ height = 1, width = 1 }) => `${((height / width) * 100).toFixed(2)}%`,
    '& ~ *': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    '& ~ img, & ~ video': {
      // ⚠️ object-fit is not supported by IE 11.
      objectFit: 'cover',
    },
  },
}

const AspectRatio = React.forwardRef(function AspectRatio(props, ref) {
  const {
    children,
    classes,
    className,
    component: Component = 'div',
    height,
    width,
    ...other
  } = props

  return (
    <Component className={classnames(classes.root, className)} ref={ref} {...other}>
      {(height || width) && <div className={classes.bounds} />}
      {children}
    </Component>
  )
})

AspectRatio.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  component: PropTypes.elementType,
  height: PropTypes.number,
  width: PropTypes.number,
}

AspectRatio.uiName = 'OuiAspectRatio'

export default withStyles(styles, { name: 'OuiAspectRatio' })(AspectRatio)
