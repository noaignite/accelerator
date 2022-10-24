import * as React from 'react'
import PropTypes from 'prop-types'
import { OverridableComponent } from '@mui/types'
import { setRef } from '@mui/material/utils'
import { clamp } from '@noaignite/utils'
import InView from '../InView'
import { ScrollProgressTypeMap } from './ScrollProgressProps'

export function calculateVerticalProgress(
  bounds: DOMRect,
  topOffset = 0,
  bottomOffset = topOffset,
) {
  const vh = window.innerHeight
  const progress = (bounds.bottom - topOffset) / (vh + bounds.height - bottomOffset * 2)

  return 1 - clamp(progress, 0, 1)
}

const ScrollProgress = React.forwardRef(function ScrollProgress(props, ref) {
  const { onChange, onEnter, onExit, ...other } = props

  const rootRef = React.useRef<HTMLDivElement | null>(null)

  const handleScroll = React.useCallback(() => {
    const target = rootRef.current
    if (!target) {
      return
    }

    const maxOffset = Math.min(target.clientHeight, window.innerHeight)
    const bounds = target.getBoundingClientRect()
    const progress = calculateVerticalProgress(bounds)
    const innerProgress = calculateVerticalProgress(bounds, maxOffset)

    if (onChange) {
      onChange({ bounds, innerProgress, progress, target })
    }
  }, [onChange])

  const handleEnter = React.useCallback(
    (entry: IntersectionObserverEntry) => {
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('resize', handleScroll)

      if (onEnter) {
        onEnter(entry)
      }
    },
    [handleScroll, onEnter],
  )

  const handleExit = React.useCallback(
    (entry: IntersectionObserverEntry) => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)

      if (onExit) {
        onExit(entry)
      }
    },
    [handleScroll, onExit],
  )

  const handleRef = React.useCallback(
    (node: HTMLDivElement) => {
      rootRef.current = node
      setRef(ref, node)

      if (node) {
        handleScroll()
      } else {
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleScroll)
      }
    },
    [handleScroll, ref],
  )

  return <InView onEnter={handleEnter} onExit={handleExit} ref={handleRef} {...other} />
}) as OverridableComponent<ScrollProgressTypeMap>

ScrollProgress.propTypes = {
  onChange: PropTypes.func,
  onEnter: PropTypes.func,
  onExit: PropTypes.func,
}

export default ScrollProgress
