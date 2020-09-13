import * as React from 'react'
import PropTypes from 'prop-types'
import { InView } from 'react-intersection-observer'
import { clamp } from '@oakwood/oui-utils'

export function calculateVerticalProgress(bounds, topOffset = 0, bottomOffset = topOffset) {
  const vh = window.innerHeight
  const progress = (bounds.bottom - topOffset) / (vh + bounds.height - bottomOffset * 2)

  return 1 - clamp(progress, 0, 1)
}

const ScrollProgress = (props) => {
  const { children, component, onChange, ...other } = props

  const entryRef = React.useRef(null)
  const [isInView, setIsInView] = React.useState(false)

  const handleIntersect = React.useCallback((inView, entry) => {
    entryRef.current = entry
    setIsInView(inView)
  }, [])

  const handleScroll = React.useCallback(() => {
    const vh = window.innerHeight
    const target = entryRef.current.target
    const bounds = target.getBoundingClientRect()
    const progress = calculateVerticalProgress(bounds)
    const innerProgress = calculateVerticalProgress(bounds, Math.min(target.clientHeight, vh))

    if (onChange) {
      onChange(progress, innerProgress, bounds)
    }
  }, [onChange])

  React.useEffect(() => {
    if (isInView) {
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('resize', handleScroll)
      handleScroll()

      return () => {
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleScroll)
      }
    }

    return undefined
  }, [handleScroll, isInView])

  return (
    <InView as={component} onChange={handleIntersect} {...other}>
      {children}
    </InView>
  )
}

ScrollProgress.propTypes = {
  children: PropTypes.node,
  component: PropTypes.elementType,
  onChange: PropTypes.func,
}

export default ScrollProgress
