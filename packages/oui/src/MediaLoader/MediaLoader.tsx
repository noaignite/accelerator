import * as React from 'react'
import PropTypes from 'prop-types'
import mediaLoaded, { MLInstance } from '@maeertin/medialoaded'
import { OverridableComponent } from '@mui/types'
import { setRef } from '@mui/material/utils'
import { MediaLoaderTypeMap } from './MediaLoaderProps'

const MediaLoader = React.forwardRef(function MediaLoader(props, ref) {
  const { children, component: Component = 'div', onLoaded, ...other } = props

  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const isPlainChildren = typeof children !== 'function'

  const [loaded, setLoaded] = React.useState(false)
  const handleLoaded = React.useCallback(
    (instance: MLInstance) => {
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
    (node: HTMLDivElement) => {
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
}) as OverridableComponent<MediaLoaderTypeMap>

MediaLoader.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  component: PropTypes.elementType,
  onLoaded: PropTypes.func,
}

export default MediaLoader
