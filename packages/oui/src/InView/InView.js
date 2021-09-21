import * as React from 'react'
import PropTypes from 'prop-types'
import { setRef } from '@mui/material/utils'
import { useThemeProps } from '@mui/material'
import { getObserverInstance } from '@noaignite/oui-utils'

const InView = React.forwardRef(function InView(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'OuiInView' })
  const {
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
      if (onEnter) {
        onEnter(entry)
      }
    },
    [observer, observerOptions, onEnter, triggerOnce],
  )

  const handleRef = React.useCallback(
    (node) => {
      if (node) {
        observer.addEnterCallback(node, handleEnter)
        observer.addExitCallback(node, onExit)
        observer.observe(node, observerOptions)
      } else {
        observer.unobserve(rootRef.current, observerOptions)
      }

      rootRef.current = node
      setRef(ref, node)
    },
    [handleEnter, observer, observerOptions, onExit, ref],
  )

  if (ContainerComponent) {
    return <ContainerComponent component={Component} ref={handleRef} {...other} />
  }

  return <Component ref={handleRef} {...other} />
})

InView.propTypes = {
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
