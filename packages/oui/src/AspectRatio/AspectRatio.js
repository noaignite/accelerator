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
    ratio: ratioProp,
    style,
    width,
    ...other
  } = props

  const ratio = ratioProp || width / height
  const composedStyle = typeof ratio === 'number' ? { '--aspect-ratio': ratio, ...style } : style

  return (
    <Component
      className={classnames(
        classes.root,
        {
          [classes.ratio]: ratio,
        },
        className,
      )}
      style={composedStyle}
      ref={ref}
      {...other}
    >
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
  ratio: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  style: PropTypes.object,
  width: PropTypes.number,
}

export default withStyles(styles, { name: 'OuiAspectRatio' })(AspectRatio)
