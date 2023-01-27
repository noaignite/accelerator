import * as React from 'react'
import PropTypes from 'prop-types'
import { setRef } from '@mui/material/utils'
import { useThemeProps } from '@mui/material'
import { getObserverInstance } from '../utils'

const InView = React.forwardRef(function InView(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'OuiInView' })
  const {
    children,
    component: Component = 'div',
    ContainerComponent,
    onEnter,
    onExit,
    root,
    rootMargin,
    threshold,
    triggerOnce,
    ...other
  } = props

  const observer = getObserverInstance()
  const rootRef = React.useRef(null)

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
    (entry) => {
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
    (entry) => {
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
    (node) => {
      if (node) {
        observer.addEnterCallback(node, handleEnter)
        observer.addExitCallback(node, handleExit)
        observer.observe(node, observerOptions)
      } else {
        observer.unobserve(rootRef.current, observerOptions)
      }

      rootRef.current = node
      setRef(ref, node)
    },
    [handleEnter, handleExit, observer, observerOptions, ref],
  )

  if (ContainerComponent) {
    return (
      <ContainerComponent component={Component} ref={handleRef} {...other}>
        {isPlainChildren ? children : children({ inView })}
      </ContainerComponent>
    )
  }

  return (
    <Component ref={handleRef} {...other}>
      {isPlainChildren ? children : children({ inView })}
    </Component>
  )
})

InView.propTypes = {
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
