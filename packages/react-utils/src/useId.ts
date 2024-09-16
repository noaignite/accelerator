import { useId as _useId } from 'react'

export type IdOptions = {
  /** A deterministic prefix for auto-generated id. */
  prefix?: string
  /** A deterministic suffix for auto-generated id. */
  suffix?: string
  /**
   * When `true`, generates an `id` attribute which can be selected
   * via functions such as `.querySelector()`
   */
  selectable?: boolean
}

/**
 * Returns a unique string.
 *
 * A modified version of React's native `useId` with prefix / suffix support and
 * optionally selectable auto-generated `id`.
 *
 * @param options - Configurable options.
 *
 * @returns `string` - A unique string.
 */
export const useId = ({ prefix, suffix, selectable }: IdOptions = {}) => {
  const id = _useId()

  const _id = selectable ? id.replace(/:/g, '') : id
  const _prefix = prefix ? `${prefix}-` : ''
  const _suffix = suffix ? `-${suffix}` : ''

  return `${_prefix}${_id}${_suffix}`
}
