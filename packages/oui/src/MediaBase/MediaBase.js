import * as React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { chainPropTypes } from '@material-ui/utils'
import withStyles from '@material-ui/core/styles/withStyles'

export const styles = {
  root: {
    display: 'block',
    width: '100%',
  },
  cover: {
    // ⚠️ object-fit is not supported by IE 11.
    objectFit: 'cover',
  },
  picture: {
    '& img': {
      display: 'inherit',
      width: 'inherit',
      height: 'inherit',
      objectFit: 'inherit',
    },
  },
}

const MediaBase = React.forwardRef(function MediaBase(props, ref) {
  const {
    children,
    classes,
    className,
    component: Component = 'img',
    lazy,
    placeholder,
    src,
    ...other
  } = props

  return (
    <Component
      className={clsx(
        classes.root,
        {
          [classes.cover]: ['video', 'picture', 'img'].includes(Component),
          [classes.picture]: ['picture'].includes(Component),
        },
        className,
      )}
      src={lazy ? placeholder : src}
      ref={ref}
      {...other}
    >
      {children}
    </Component>
  )
})

MediaBase.propTypes = {
  children: chainPropTypes(PropTypes.node, (props) => {
    if (!props.children && !props.src && !props.component) {
      return new Error(
        'Oakwood-UI: Either `children`, `src` or `component` prop must be specified.',
      )
    }
    return null
  }),
  classes: PropTypes.object,
  className: PropTypes.string,
  component: PropTypes.elementType,
  lazy: PropTypes.bool,
  placeholder: PropTypes.string,
  src: PropTypes.string,
}

export default withStyles(styles, { name: 'OuiMediaBase' })(MediaBase)
