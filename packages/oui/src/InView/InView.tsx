import * as React from 'react'
import PropTypes from 'prop-types'
import { OverridableComponent } from '@mui/types'
import { setRef } from '@mui/material/utils'
import { useThemeProps } from '@mui/material'
import { getObserverInstance } from '../utils'
import { InViewProps, InViewTypeMap } from './InViewProps'

const InView = React.forwardRef(function InView(inProps: InViewProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'OuiInView' })
  const {
    additionalProps,
    children,
    component: Component = 'div',
    // ContainerComponent,
    onEnter,
    onExit,
    root,
    rootMargin,
    threshold,
    triggerOnce,
    ...other
  } = props

  const observer = getObserverInstance()
  const rootRef = React.useRef<HTMLDivElement | null>(null)

  const [inView, setInView] = React.useState(false)

  const isPlainChildren = typeof children !== 'function'

  const observerOptions = React.useMemo(
    () => ({
      root,
      rootMargin,
      threshold,
    }),
    [root, rootMargin, threshold],
  )

  const handleEnter = React.useCallback(
    (entry: IntersectionObserverEntry) => {
      if (!rootRef.current) return

      if (triggerOnce) {
        observer.unobserve(rootRef.current, observerOptions)
      }
      if (!isPlainChildren) {
        setInView(true)
      }
      if (onEnter) {
        onEnter(entry)
      }
    },
    [isPlainChildren, observer, observerOptions, onEnter, triggerOnce],
  )

  const handleExit = React.useCallback(
    (entry: IntersectionObserverEntry) => {
      if (!isPlainChildren) {
        setInView(false)
      }
      if (onExit) {
        onExit(entry)
      }
    },
    [isPlainChildren, onExit],
  )

  const handleRef = React.useCallback(
    (node: HTMLDivElement) => {
      if (node) {
        observer.addEnterCallback(node, handleEnter)
        observer.addExitCallback(node, handleExit)
        observer.observe(node, observerOptions)
      } else if (rootRef.current) {
        observer.unobserve(rootRef.current, observerOptions)
      }

      rootRef.current = node
      setRef(ref, node)
    },
    [handleEnter, handleExit, observer, observerOptions, ref],
  )

  return (
    <Component ref={handleRef} {...additionalProps} {...other}>
      {isPlainChildren ? children : children({ inView })}
    </Component>
  )
}) as OverridableComponent<InViewTypeMap>

InView.propTypes = {
  additionalProps: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  component: PropTypes.elementType,
  ContainerComponent: PropTypes.elementType,
  onEnter: PropTypes.func,
  onExit: PropTypes.func,
  root: PropTypes.element,
  rootMargin: PropTypes.string,
  threshold: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
  triggerOnce: PropTypes.bool,
}

export default InView
