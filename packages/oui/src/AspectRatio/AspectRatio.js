import * as React from 'react'
import PropTypes from 'prop-types'
import classnames from 'clsx'
import withStyles from '@material-ui/core/styles/withStyles'

export const styles = {
  root: {
    display: 'block',
    position: 'relative',
    width: '100%',
  },
  ratio: {
    '& ~ *': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    '& ~ video, & ~ picture, & ~ img': {
      // ⚠️ object-fit is not supported by IE 11.
      objectFit: 'cover',
    },
  },
}

export function calculateRatio(width, height) {
  return ((height / width) * 100).toFixed(2)
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
      {height && width && (
        <div
          className={classes.ratio}
          style={{ paddingBottom: `${calculateRatio(width, height)}%` }}
        />
      )}
      {children}
    </Component>
  )
})

AspectRatio.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object,
  className: PropTypes.string,
  component: PropTypes.elementType,
  height: PropTypes.number,
  width: PropTypes.number,
}

export default withStyles(styles, { name: 'OuiAspectRatio' })(AspectRatio)
