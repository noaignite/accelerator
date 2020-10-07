import * as React from 'react'
import PropTypes from 'prop-types'
import classnames from 'clsx'
import { capitalize } from '@material-ui/core/utils'
import withStyles from '@material-ui/core/styles/withStyles'

export const styles = () => {
  const absolute = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }

  return {
    root: {
      ...absolute,
      zIndex: -1,
      // ⚠️ clip-path is not supported by IE 11.
      clipPath: 'inset(0 0 0 0)', // Use `clipPath` as `overflow="hidden"` breaks `position="sticky"`
      WebkitClipPath: 'inset(0 0 0 0)',
    },
    container: {
      ...absolute,
    },
    containerFixed: {
      position: 'fixed',
    },
    containerSticky: {
      bottom: '-100%',
    },
    wrapper: {
      ...absolute,
      '& *': {
        height: '100%',
      },
    },
    wrapperFixed: {},
    wrapperSticky: {
      position: 'sticky',
      bottom: 'auto',
      height: '50%',
    },
  }
}

const BackgroundMedia = React.forwardRef(function BackgroundMedia(props, ref) {
  const { attachment = 'static', children, classes, className, ...other } = props

  return (
    <div className={classnames(classes.root, className)} ref={ref} {...other}>
      <div
        className={classnames(classes.container, {
          [classes[`container${capitalize(attachment)}`]]: attachment !== 'static',
        })}
        data-testid="container"
      >
        <div
          className={classnames(classes.wrapper, {
            [classes[`wrapper${capitalize(attachment)}`]]: attachment !== 'static',
          })}
          data-testid="wrapper"
        >
          {children}
        </div>
      </div>
    </div>
  )
})

BackgroundMedia.propTypes = {
  attachment: PropTypes.oneOf(['static', 'fixed', 'sticky']),
  children: PropTypes.node,
  classes: PropTypes.object,
  className: PropTypes.string,
}

export default withStyles(styles, { name: 'OuiBackgroundMedia' })(BackgroundMedia)
