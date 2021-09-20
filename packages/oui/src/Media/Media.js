// @inheritedComponent MediaBase

import * as React from 'react'
import PropTypes from 'prop-types'
import { useTheme, useThemeProps } from '@mui/material'
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
  const reversedBreakpointKeys = [...theme.breakpoints.keys].reverse()

  const [lazy, setLazy] = React.useState(!priority)
  const handleEnter = React.useCallback(() => {
    setLazy(false)
  }, [])

  let componentProps = { component, lazy, placeholder, src, ref, ...other }
  let ContainerComponent = MediaBase
  let sources

  if (component === 'picture') {
    const [imgProps, restProps] = extractImgProps(componentProps)
    componentProps = {
      children: <img alt="" {...imgProps} />,
      ...restProps,
    }

    if (breakpoints) {
      sources = []
      const children = []

      reversedBreakpointKeys.forEach((key, idx) => {
        const srcOrSources = breakpoints[key]
        if (!srcOrSources) {
          return
        }

        const min = theme.breakpoints.values[key]
        const max = theme.breakpoints.values[reversedBreakpointKeys[idx - 1]] - 1 || 9999
        const media = `(min-width: ${min}px)`

        if (typeof srcOrSources === 'string') {
          sources.push({ min, max, src: srcOrSources })
          children.push(generateSource({ lazy, media, placeholder, src: srcOrSources }))
        } else if (Array.isArray(srcOrSources)) {
          srcOrSources.forEach((source) => {
            sources.push({ min, max, ...source })
            children.push(generateSource({ lazy, media, placeholder, ...source }))
          })
        }
      })

      componentProps.children = React.Children.toArray(componentProps.children)
      componentProps.children.unshift(children)
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
      {shouldPreload && generatePreload({ component, sources, src, ...other })}
      <ContainerComponent {...componentProps} />
    </React.Fragment>
  )
})

Media.propTypes = {
  breakpoints: PropTypes.shape({
    xs: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]).isRequired,
    sm: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
    md: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
    lg: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
    xl: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
  }),
  component: PropTypes.elementType,
  generatePreload: PropTypes.func,
  placeholder: PropTypes.string,
  priority: PropTypes.bool,
  rootMargin: PropTypes.string,
  src: PropTypes.string,
}

export default Media
