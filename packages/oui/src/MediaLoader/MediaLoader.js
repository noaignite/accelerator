import * as React from 'react'
import PropTypes from 'prop-types'
import mediaLoaded from '@maeertin/medialoaded'
import { setRef } from '@material-ui/core/utils'

const MediaLoader = React.forwardRef(function MediaLoader(props, ref) {
  const { children, component: Component = 'div', onLoaded, ...other } = props

  const rootRef = React.useRef(null)
  const isPlainChildren = typeof children !== 'function'

  const [loaded, setLoaded] = React.useState(false)
  const handleLoaded = React.useCallback(
    (instance) => {
      if (rootRef.current) {
        if (!isPlainChildren) {
          setLoaded(true)
        }
        if (onLoaded) {
          onLoaded(instance)
        }
      }
    },
    [isPlainChildren, onLoaded],
  )

  const handleRef = React.useCallback(
    (node) => {
      rootRef.current = node
      setRef(ref, node)

      if (node) {
        mediaLoaded(node, handleLoaded)
      }
    },
    [handleLoaded, ref],
  )

  return (
    <Component ref={handleRef} {...other}>
      {isPlainChildren ? children : children({ loaded })}
    </Component>
  )
})

MediaLoader.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  component: PropTypes.elementType,
  onLoaded: PropTypes.func,
}

export default MediaLoader
