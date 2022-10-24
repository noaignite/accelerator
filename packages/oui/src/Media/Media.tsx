import * as React from 'react'
import PropTypes from 'prop-types'
import { OverridableComponent } from '@mui/types'
import { Breakpoint, useTheme, useThemeProps } from '@mui/material'
import mediaBreakpointsType from '../utils/mediaBreakpointsType'
import InView from '../InView'
import MediaBase from '../MediaBase'
import MediaWithWidth from '../MediaWithWidth'
import {
  ExtendMedia,
  MediaPictureBreakpoints,
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

  if (component === 'picture') {
    console.log(inProps, component, breakpoints)
  } else {
    console.log(inProps, component, breakpoints)
  }

  if (inProps.component === 'picture') {
    console.log(inProps, inProps.component, inProps.breakpoints)
  } else {
    console.log(inProps, inProps.component, inProps.breakpoints)
  }

  const [lazy, setLazy] = React.useState(!priority)
  const handleEnter = React.useCallback(() => {
    setLazy(false)
  }, [])

  let componentProps = {
    component,
    src: lazy ? placeholder : src,
    ref,
    ...other,
  }
  let ContainerComponent = MediaBase
  let preloadSources

  if (component === 'picture') {
    const [imgProps, restProps] = extractImgProps(componentProps)
    componentProps = {
      children: <img alt="" {...imgProps} />,
      ...restProps,
    }

    if (breakpoints) {
      const pictureBreakpoints = breakpoints as MediaPictureBreakpoints
      preloadSources = []

      const validateBreakpointKey = (key: Breakpoint) => Boolean(pictureBreakpoints[key])
      const filteredBreakpointKeys = theme.breakpoints.keys.filter(validateBreakpointKey)

      const sources: React.ReactNode[] = []

      filteredBreakpointKeys.forEach((key, idx, arr) => {
        const srcOrSources = pictureBreakpoints[key]
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

          sources.unshift(
            <source key={srcOrSources} media={media} srcSet={lazy ? placeholder : srcOrSources} />,
          )
        } else if ('src' in srcOrSources) {
          preloadSources.unshift({ media, ...srcOrSources })

          const { src: breakpointSrc, ...more } = srcOrSources
          sources.unshift(
            <source
              key={breakpointSrc}
              media={media}
              srcSet={lazy ? placeholder : breakpointSrc}
              {...more}
            />,
          )
        } else if (Array.isArray(srcOrSources)) {
          srcOrSources.forEach((source) => {
            preloadSources.unshift({ media, ...source })

            const { src: breakpointSrc, ...more } = source
            sources.unshift(
              <source
                key={breakpointSrc}
                media={media}
                srcSet={lazy ? placeholder : breakpointSrc}
                {...more}
              />,
            )
          })
        }
      })

      // componentProps.children = [...sources, componentProps.children]
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
}) as OverridableComponent<MediaTypeMap>

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
