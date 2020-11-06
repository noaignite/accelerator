import * as React from 'react'
import PropTypes from 'prop-types'
import classnames from 'clsx'
import innerHeight from 'ios-inner-height'
import { capitalize, debounce } from '@material-ui/core/utils'
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
      '& *': {
        height: '100%',
      },
    },
    clipPath: {
      // ⚠️ clip-path is not supported by IE 11.
      clipPath: 'inset(-1px 0 -1px 0)', // Negative top & bottom due to sub-pixel rendering
      WebkitClipPath: 'inset(-1px 0 -1px 0)', // Negative top & bottom due to sub-pixel rendering
    },
    container: absolute,
    containerFixed: {
      position: 'fixed',
    },
    containerSticky: {
      bottom: '-100%',
      height: 'auto',
    },
    wrapper: absolute,
    wrapperFixed: {},
    wrapperSticky: {
      position: 'sticky',
      bottom: 'auto',
      height: '50%',
    },
  }
}

const useEnhancedEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect

const BackgroundMedia = React.forwardRef(function BackgroundMedia(props, ref) {
  const { attachment = 'static', children: childrenProp, classes, className, ...other } = props

  const [height, setHeight] = React.useState(0)
  useEnhancedEffect(() => {
    if (attachment === 'fixed') {
      setHeight(innerHeight())

      const handleResize = debounce(() => {
        setHeight(innerHeight())
      })

      window.addEventListener('resize', handleResize)
      return () => {
        handleResize.clear()
        window.removeEventListener('resize', handleResize)
      }
    }

    return undefined
  }, [attachment])

  let children = childrenProp
  if (attachment !== 'static') {
    children = (
      <div
        className={classnames(classes.container, [classes[`container${capitalize(attachment)}`]])}
      >
        <div
          className={classnames(classes.wrapper, [classes[`wrapper${capitalize(attachment)}`]], {
            'mui-fixed': attachment === 'fixed',
          })}
          style={attachment === 'fixed' ? { height } : undefined}
        >
          {children}
        </div>
      </div>
    )
  }

  return (
    <div
      className={classnames(
        classes.root,
        {
          [classes.clipPath]: attachment !== 'static',
        },
        className,
      )}
      ref={ref}
      {...other}
    >
      {children}
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
