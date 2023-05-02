import * as React from 'react'
import PropTypes from 'prop-types'
import { OverridableComponent } from '@mui/types'
import { Breakpoint, useTheme, useThemeProps } from '@mui/material'
import mediaBreakpointsType from '../utils/mediaBreakpointsType'
import InView from '../InView'
import MediaBase from '../MediaBase'
import MediaWithWidth, { MediaWithWidthBreakpoints } from '../MediaWithWidth'
import {
  // ExtendMedia,
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

const Media = React.forwardRef(function Media(inProps: MediaProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'OuiMedia' })
  const {
    breakpoints,
    component = 'img',
    generatePreload,
    height,
    priority,
    rootMargin = '256px', // Value based on: https://web.dev/lazy-loading-best-practices/,
    src,
    width,
    ...other
  } = props

  const theme = useTheme()

  const [lazy, setLazy] = React.useState(!priority)
  const handleEnter = React.useCallback(() => {
    setLazy(false)
  }, [])

  let rootProps: MediaProps = {
    component,
    height,
    loading: lazy ? 'lazy' : undefined,
    ref,
    src,
    width,
    ...other,
  }
  let RootComponent = MediaBase
  let preloadSources

  if (component === 'picture') {
    const [imgProps, restProps] = extractImgProps(rootProps)
    rootProps = {
      children: <img alt="" {...imgProps} />,
      height,
      width,
      ...restProps,
    }

    if (breakpoints) {
      const pictureBreakpoints = breakpoints as MediaPictureBreakpoints
      preloadSources = []

      const validateBreakpointKey = (key: Breakpoint) => Boolean(breakpoints[key])
      const filteredBreakpointKeys = theme.breakpoints.keys.filter(validateBreakpointKey)

      const sources: JSX.Element[] = []

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

          sources.unshift(<source key={srcOrSources} media={media} srcSet={srcOrSources} />)
        } else if ('src' in srcOrSources) {
          preloadSources.unshift({ media, ...srcOrSources })

          const { src: srcSet, ...more } = srcOrSources
          sources.unshift(<source key={srcSet} media={media} srcSet={srcSet} {...more} />)
        }
      })

      rootProps.children = (
        <React.Fragment>
          {sources}
          {rootProps.children}
        </React.Fragment>
      )
    }
  } else if (breakpoints) {
    const otherBreakpoints = breakpoints as MediaWithWidthBreakpoints
    rootProps.breakpoints = otherBreakpoints

    RootComponent = MediaWithWidth
  }

  if (!priority && component === 'video') {
    return (
      <InView
        onEnter={handleEnter}
        rootMargin={rootMargin}
        triggerOnce
        {...rootProps}
        // Escape hatch to forward the `component` prop to `RootComponent`.
        component={RootComponent}
        additionalProps={{ component: rootProps.component }}
        // Override props below as we use a custom lazy loading strategy.
        loading={undefined}
        src={lazy ? undefined : src}
      />
    )
  }

  // No need to add preloads on the client side. By the time the application is hydrated,
  // it's too late for preloads.
  const shouldPreload =
    generatePreload && (typeof window === 'undefined' || process.env.NODE_ENV === 'test')

  // const isValidPreloadMedia = typeof component === 'string' && PRELOAD_TYPES.includes(component)
  // const isValidPreloadMedia = typeof component === 'string' && component in MEDIA_PRELOAD_TYPES
  const isValidPreloadMedia =
    typeof component === 'string' &&
    (component === 'audio' || component === 'img' || component === 'video')

  return (
    <React.Fragment>
      {shouldPreload &&
        isValidPreloadMedia &&
        generatePreload({
          mediaType: MEDIA_PRELOAD_TYPES[component] as MediaPreloadType,
          sources: preloadSources,
          src,
          ...other,
        })}

      <RootComponent {...rootProps} />
    </React.Fragment>
  )
}) as OverridableComponent<MediaTypeMap>

Media.propTypes = {
  breakpoints: mediaBreakpointsType,
  component: PropTypes.elementType,
  generatePreload: PropTypes.func,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  priority: PropTypes.bool,
  rootMargin: PropTypes.string,
  src: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

export default Media
