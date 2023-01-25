import * as React from 'react'
import PropTypes from 'prop-types'
import { setRef } from '@mui/material/utils'
import { clamp } from '@noaignite/utils'
import InView from '../InView'

export function calculateVerticalProgress(bounds, topOffset = 0, bottomOffset = topOffset) {
  const vh = window.innerHeight
  const progress = (bounds.bottom - topOffset) / (vh + bounds.height - bottomOffset * 2)

  return 1 - clamp(progress, 0, 1)
}

const ScrollProgress = React.forwardRef(function ScrollProgress(props, ref) {
  const { friction = 0, onChange, onEnter, onExit, precision = 0.001, ...other } = props

  const rootRef = React.useRef(null)

  const stateRef = React.useRef({
    isUpdating: false,
    rafInnerProgress: 0,
    rafProgress: 0,
    scrollInnerProgress: 0,
    scrollProgress: 0,
  })

  const handleRaf = React.useCallback(() => {
    const deltaIP = stateRef.current.scrollInnerProgress - stateRef.current.rafInnerProgress
    const deltaP = stateRef.current.scrollProgress - stateRef.current.rafProgress

    stateRef.current.rafInnerProgress += deltaIP * (1 - +friction)
    stateRef.current.rafProgress += deltaP * (1 - +friction)

    stateRef.current.isUpdating = Math.abs(deltaIP) > +precision || Math.abs(deltaP) > +precision

    if (stateRef.current.isUpdating) {
      requestAnimationFrame(handleRaf)
    }

    if (onChange) {
      onChange({
        innerProgress: stateRef.current.rafInnerProgress,
        progress: stateRef.current.rafProgress,
        target: rootRef.current,
      })
    }
  }, [friction, onChange, precision])

  const handleScroll = React.useCallback(() => {
    const maxOffset = Math.min(rootRef.current.clientHeight, window.innerHeight)
    const bounds = rootRef.current.getBoundingClientRect()
    const progress = calculateVerticalProgress(bounds)
    const innerProgress = calculateVerticalProgress(bounds, maxOffset)

    stateRef.current.scrollInnerProgress = innerProgress
    stateRef.current.scrollProgress = progress

    if (!stateRef.current.isUpdating) {
      requestAnimationFrame(handleRaf)
    }
  }, [handleRaf])

  const handleEnter = React.useCallback(
    (entry) => {
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('resize', handleScroll)

      if (onEnter) {
        onEnter(entry)
      }
    },
    [handleScroll, onEnter],
  )

  const handleExit = React.useCallback(
    (entry) => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)

      if (onExit) {
        onExit(entry)
      }
    },
    [handleScroll, onExit],
  )

  const handleRef = React.useCallback(
    (node) => {
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
})

ScrollProgress.propTypes = {
  friction: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func,
  onEnter: PropTypes.func,
  onExit: PropTypes.func,
  precision: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

export default ScrollProgress
