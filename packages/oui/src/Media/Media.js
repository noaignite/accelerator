// @inheritedComponent MediaBase

import * as React from 'react'
import PropTypes from 'prop-types'
import { useTheme, useThemeProps } from '@mui/material'
import mediaBreakpointsType from '../utils/mediaBreakpointsType'
import InView from '../InView'
import MediaBase from '../MediaBase'
import MediaWithWidth from './MediaWithWidth'

const IMG_ATTRIBUTES = ['alt', 'decoding', 'height', 'loading', 'sizes', 'src', 'srcSet', 'width']

/**
 * Separates the argument into two entries. First one containing attributes
 * which should be applied to `img`s, second one containing the remaining values.
 * @param {object} props
 * @return {array} [imgProps, restProps]
 */
export function extractImgProps(props) {
  return Object.keys(props).reduce(
    (acc, key) => {
      acc[Number(IMG_ATTRIBUTES.indexOf(key) === -1)][key] = props[key]
      return acc
    },
    [{}, {}],
  )
}

export function generateSource({ lazy, media, placeholder, src, ...other }) {
  return <source key={src} media={media} srcSet={lazy ? placeholder : src} {...other} />
}

const Media = React.forwardRef(function Media(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'OuiMedia' })
  const {
    breakpoints,
    component = 'img',
    generatePreload,
    placeholder,
    priority,
    rootMargin = '256px', // Value based on: https://web.dev/lazy-loading-best-practices/,
    src,
    ...other
  } = props

  const theme = useTheme()

  const [lazy, setLazy] = React.useState(!priority)
  const handleEnter = React.useCallback(() => {
    setLazy(false)
  }, [])

  let componentProps = { component, lazy, placeholder, src, ref, ...other }
  let ContainerComponent = MediaBase
  let preloadSources

  if (component === 'picture') {
    const [imgProps, restProps] = extractImgProps(componentProps)
    componentProps = {
      children: <img alt="" {...imgProps} />,
      ...restProps,
    }

    if (breakpoints) {
      preloadSources = []

      const validateBreakpointKey = (key) => Boolean(breakpoints[key])
      const filteredBreakpointKeys = theme.breakpoints.keys.filter(validateBreakpointKey)

      const sources = []

      filteredBreakpointKeys.forEach((key, idx, arr) => {
        const srcOrSources = breakpoints[key]

        let media = theme.breakpoints.up(key)
        if ((idx === 0 && arr.length > 1) || idx !== arr.length - 1) {
          media = theme.breakpoints.between(key, arr[idx + 1])
        }
        media = media.replace('@media ', '')

        if (typeof srcOrSources === 'string') {
          preloadSources.unshift({ media, src: srcOrSources })
          sources.unshift(generateSource({ lazy, media, placeholder, src: srcOrSources }))
        } else if ('src' in srcOrSources) {
          preloadSources.unshift({ media, ...srcOrSources })
          sources.unshift(generateSource({ lazy, media, placeholder, ...srcOrSources }))
        } else if (Array.isArray(srcOrSources)) {
          srcOrSources.forEach((source) => {
            preloadSources.unshift({ media, ...source })
            sources.unshift(generateSource({ lazy, media, placeholder, ...source }))
          })
        }
      })

      componentProps.children = React.Children.toArray(componentProps.children)
      componentProps.children.unshift(sources)
    }
  } else if (breakpoints) {
    componentProps.breakpoints = breakpoints
    ContainerComponent = MediaWithWidth
  }

  if (!priority) {
    return (
      <InView
        ContainerComponent={ContainerComponent}
        onEnter={handleEnter}
        rootMargin={rootMargin}
        triggerOnce
        {...componentProps}
      />
    )
  }

  // No need to add preloads on the client side. By the time the application is hydrated,
  // it's too late for preloads.
  const shouldPreload = generatePreload && typeof window === 'undefined'

  return (
    <React.Fragment>
      {shouldPreload && generatePreload({ component, sources: preloadSources, src, ...other })}
      <ContainerComponent {...componentProps} />
    </React.Fragment>
  )
})

Media.propTypes = {
  breakpoints: mediaBreakpointsType,
  component: PropTypes.elementType,
  generatePreload: PropTypes.func,
  placeholder: PropTypes.string,
  priority: PropTypes.bool,
  rootMargin: PropTypes.string,
  src: PropTypes.string,
}

export default Media
