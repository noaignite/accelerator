import * as React from 'react'
import PropTypes from 'prop-types'
import { setRef } from '@mui/material/utils'
import { clamp } from '@noaignite/utils'
import InView from '../InView'

export function calculateVerticalProgress(
  bounds,
  elementTop = 0,
  topOffset = 0,
  bottomOffset = topOffset,
) {
  const vh = window.innerHeight
  const bottom = bounds.height - window.scrollY + elementTop
  const progress = (bottom - topOffset) / (vh + bounds.height - bottomOffset * 2)

  return 1 - clamp(progress, 0, 1)
}

const ScrollProgress = React.forwardRef(function ScrollProgress(props, ref) {
  const { onChange, onEnter, onExit, ...other } = props

  const rootRef = React.useRef(null)
  const bounds = React.useRef(null)
  const elementTop = React.useRef(0)

  const handleScroll = React.useCallback(() => {
    const target = rootRef.current
    const maxOffset = Math.min(target.clientHeight, window.innerHeight)
    const progress = calculateVerticalProgress(bounds.current, elementTop.current)
    const innerProgress = calculateVerticalProgress(bounds.current, elementTop.current, maxOffset)

    if (onChange) {
      onChange({ bounds, innerProgress, progress, target })
    }
  }, [onChange])

  const handleResize = React.useCallback(() => {
    const target = rootRef.current
    bounds.current = target.getBoundingClientRect()
    elementTop.current = bounds.current.top + window.scrollY

    // make sure scroll logic is updated when resizing
    handleScroll()
  }, [handleScroll])

  const handleEnter = React.useCallback(
    (entry) => {
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('resize', handleResize)

      if (onEnter) {
        onEnter(entry)
      }
    },
    [handleScroll, handleResize, onEnter],
  )

  const handleExit = React.useCallback(
    (entry) => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)

      if (onExit) {
        onExit(entry)
      }
    },
    [handleScroll, handleResize, onExit],
  )

  const handleRef = React.useCallback(
    (node) => {
      rootRef.current = node
      setRef(ref, node)

      if (node) {
        handleResize()
        handleScroll()
      } else {
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleResize)
      }
    },
    [handleScroll, handleResize, ref],
  )

  return <InView onEnter={handleEnter} onExit={handleExit} ref={handleRef} {...other} />
})

ScrollProgress.propTypes = {
  onChange: PropTypes.func,
  onEnter: PropTypes.func,
  onExit: PropTypes.func,
}

export default ScrollProgress
