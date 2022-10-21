import * as React from 'react'
import PropTypes from 'prop-types'
import { OverridableComponent } from '@mui/types'
import { Breakpoint, useTheme, useThemeProps } from '@mui/material'
import mediaBreakpointsType from '../utils/mediaBreakpointsType'
import InView from '../InView'
import MediaBase from '../MediaBase'
import MediaWithWidth, { MediaWithWidthProps } from '../MediaWithWidth'
import {
  ExtendMedia,
  ExtendMediaTypeMap,
  MediaPreloadType,
  MediaProps,
  MediaTypeMap,
} from './MediaProps'

const IMG_ATTRIBUTES = ['alt', 'decoding', 'height', 'loading', 'sizes', 'src', 'srcSet', 'width']

const MEDIA_PRELOAD_TYPES = {
  audio: 'audio',
  img: 'image',
  video: 'video',
}

function isPicture(props: MediaProps | MediaWithWidthProps): props is MediaProps {
  return typeof props.component === 'string' && props.component === 'picture'
}

// Test code, remove when done
const options: MediaProps | MediaWithWidthProps = {
  component: 'picture',
}
if (isPicture(options)) {
  console.log(options)
} else if (typeof options === 'object') {
  console.log(options)
}

/**
 * Separates the argument into two entries. First one containing attributes
 * which should be applied to `img`s, second one containing the remaining values.
 * @param {object} props
 * @return {array} [imgProps, restProps]
 */
export function extractImgProps(props: Record<string, unknown>) {
  return Object.keys(props).reduce(
    (acc: [Record<string, unknown>, Record<string, unknown>], key) => {
      acc[Number(IMG_ATTRIBUTES.indexOf(key) === -1)][key] = props[key]
      return acc
    },
    [{}, {}],
  )
}

const Media = React.forwardRef(function Media(props, ref) {
  // const props = useThemeProps({ props: inProps, name: 'OuiMedia' })
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

  if (component === 'picture') {
    component
    console.log(breakpoints)
  } else {
    console.log(breakpoints)
  }
  const theme = useTheme()

  const [lazy, setLazy] = React.useState(!priority)
  const handleEnter = React.useCallback(() => {
    setLazy(false)
  }, [])

  let componentProps: typeof inProps = {
    component,
    src: lazy ? placeholder : src,
    ref,
    ...other,
  }
  let ContainerComponent = MediaBase
  let preloadSources

  if (inProps.component === 'picture') {
    // if (isPicture(componentProps)) {
    const [imgProps, restProps] = extractImgProps(componentProps)
    componentProps = {
      children: <img alt="" {...imgProps} />,
      ...restProps,
    }

    if (breakpoints) {
      preloadSources = []

      const validateBreakpointKey = (key: Breakpoint) => Boolean(breakpoints[key])
      const filteredBreakpointKeys = theme.breakpoints.keys.filter(validateBreakpointKey)

      const sources: React.ReactNode[] = []

      filteredBreakpointKeys.forEach((key, idx, arr) => {
        const srcOrSources = breakpoints[key]
        if (!srcOrSources) {
          return
        }

        let media = theme.breakpoints.up(key)
        if ((idx === 0 && arr.length > 1) || idx !== arr.length - 1) {
          media = theme.breakpoints.between(key, arr[idx + 1])
        }
        media = media.replace('@media ', '')

        if (typeof srcOrSources === 'string') {
          preloadSources.unshift({ media, src: srcOrSources })

          sources.unshift(<source media={media} srcSet={lazy ? placeholder : srcOrSources} />)
        } else if ('src' in srcOrSources) {
          preloadSources.unshift({ media, ...srcOrSources })

          const { src: breakpointSrc, ...more } = srcOrSources
          sources.unshift(
            <source media={media} srcSet={lazy ? placeholder : breakpointSrc} {...more} />,
          )
        } else if (Array.isArray(srcOrSources)) {
          srcOrSources.forEach((source) => {
            preloadSources.unshift({ media, ...source })

            const { src: breakpointSrc, ...more } = source
            sources.unshift(
              <source media={media} srcSet={lazy ? placeholder : breakpointSrc} {...more} />,
            )
          })
        }
      })

      componentProps.children = [...sources, componentProps.children]
      // componentProps.children = React.Children.toArray(componentProps.children)
      // componentProps.children.unshift(sources)
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

  let preload = null

  // No need to add preloads on the client side. By the time the application is hydrated,
  // it's too late for preloads.
  const shouldPreload = generatePreload && typeof window === 'undefined'
  // const isValidPreloadMedia = typeof component === 'string' && PRELOAD_TYPES.includes(component)
  // const isValidPreloadMedia = typeof component === 'string' && component in MEDIA_PRELOAD_TYPES
  const isValidPreloadMedia =
    typeof component === 'string' &&
    (component === 'audio' || component === 'img' || component === 'video')

  if (shouldPreload && isValidPreloadMedia) {
    preload = generatePreload({
      mediaType: MEDIA_PRELOAD_TYPES[component] as MediaPreloadType,
      sources: preloadSources,
      src,
      ...other,
    })
  }

  return (
    <React.Fragment>
      {preload}
      <ContainerComponent {...componentProps} />
    </React.Fragment>
  )
}) as OverridableComponent<ExtendMediaTypeMap<MediaTypeMap>>

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
