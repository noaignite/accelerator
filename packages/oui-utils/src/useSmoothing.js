import * as React from 'react'
import lerp from './lerp'

/**
 * Smoothes out a value over time
 *
 * @param {function} callback which receives smoothed out value as argument.
 * @param {object} options to modify friction and precision values.
 * @returns {array} updaters, use set & stop to trigger smoothing timeline.
 */
export default function useSmoothing(callback, options = {}) {
  const { friction = 0.8, precision = 0.001 } = options

  const currentValueRef = React.useRef(null)
  const targetValueRef = React.useRef(null)
  const rafRef = React.useRef(null)

  const handleRaf = React.useCallback(() => {
    currentValueRef.current = lerp(currentValueRef.current, targetValueRef.current, 1 - friction)
    callback(currentValueRef.current)

    if (Math.abs(targetValueRef.current - currentValueRef.current) > precision) {
      rafRef.current = requestAnimationFrame(handleRaf)
    }
  }, [callback, friction, precision])

  const set = React.useCallback(
    (value) => {
      targetValueRef.current = value

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      rafRef.current = requestAnimationFrame(handleRaf)
    },
    [handleRaf],
  )

  const stop = React.useCallback(() => {
    cancelAnimationFrame(rafRef.current)
  }, [])

  return [set, stop]
}
