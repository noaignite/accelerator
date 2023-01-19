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
    currentInnerProgress: 0,
    currentProgress: 0,
    isEasing: false,
    targetInnerProgress: 0,
    targetProgress: 0,
  })

  const handleRaf = React.useCallback(() => {
    const deltaIP = stateRef.current.targetInnerProgress - stateRef.current.currentInnerProgress
    const deltaP = stateRef.current.targetProgress - stateRef.current.currentProgress

    stateRef.current.currentInnerProgress += deltaIP * (1 - friction)
    stateRef.current.currentProgress += deltaP * (1 - friction)

    stateRef.current.isEasing = Math.abs(deltaIP) > precision || Math.abs(deltaP) > precision

    if (stateRef.current.isEasing) {
      requestAnimationFrame(handleRaf)
    }

    if (onChange) {
      onChange({
        innerProgress: stateRef.current.currentInnerProgress,
        progress: stateRef.current.currentProgress,
        target: rootRef.current,
      })
    }
  }, [friction, onChange, precision])

  const handleScroll = React.useCallback(() => {
    const maxOffset = Math.min(rootRef.current.clientHeight, window.innerHeight)
    const bounds = rootRef.current.getBoundingClientRect()
    const progress = calculateVerticalProgress(bounds)
    const innerProgress = calculateVerticalProgress(bounds, maxOffset)

    stateRef.current.targetInnerProgress = innerProgress
    stateRef.current.targetProgress = progress

    if (!stateRef.current.isEasing) {
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
  friction: PropTypes.number,
  onChange: PropTypes.func,
  onEnter: PropTypes.func,
  onExit: PropTypes.func,
  precision: PropTypes.number,
}

export default ScrollProgress
