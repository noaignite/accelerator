// @inheritedComponent MediaBase

import * as React from 'react'
import PropTypes from 'prop-types'
import InView from '../InView'
import MediaBase from '../MediaBase'
import MediaSources from './MediaSources'
import MediaWithWidth from './MediaWithWidth'

const IMG_ATTRIBUTES = ['alt', 'height', 'loading', 'sizes', 'src', 'srcSet', 'width']

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

const Media = React.forwardRef(function Media(props, ref) {
  const { breakpoints, component = 'img', lazy: lazyProp, src, ...other } = props

  const [lazy, setLazy] = React.useState(lazyProp)
  const handleEnter = React.useCallback(() => {
    setLazy(false)
  }, [])

  let componentProps = { ...other }
  let ContainerComponent = MediaBase

  if (component === 'picture') {
    const [imgProps, restProps] = extractImgProps(componentProps)
    componentProps = {
      children: <img src={src} alt="" {...imgProps} />,
      ...restProps,
    }
    if (breakpoints) {
      componentProps.children = React.Children.toArray(componentProps.children)
      componentProps.children.unshift(
        <MediaSources key="sources" breakpoints={breakpoints} lazy={lazy} />,
      )
    }
  } else if (breakpoints) {
    componentProps.breakpoints = breakpoints
    ContainerComponent = MediaWithWidth
  } else {
    componentProps.src = src
  }

  if (lazyProp) {
    return (
      <InView
        ContainerComponent={ContainerComponent}
        component={component}
        onEnter={handleEnter}
        lazy={lazy}
        /**
         * `rootMargin` default based on Chromium 4G load-in distance threshold
         * https://web.dev/native-lazy-loading/#load-in-distance-threshold
         * https://source.chromium.org/chromium/chromium/src/+/master:third_party/blink/renderer/core/frame/settings.json5;drc=e8f3cf0bbe085fee0d1b468e84395aad3ebb2cad;l=971-1003?originalUrl=https:%2F%2Fcs.chromium.org%2Fchromium%2Fsrc%2Fthird_party%2Fblink%2Frenderer%2Fcore%2Fframe%2Fsettings.json5
         */
        rootMargin="3000px 0px"
        triggerOnce
        ref={ref}
        {...componentProps}
      />
    )
  }

  return <ContainerComponent component={component} ref={ref} {...componentProps} />
})

Media.propTypes = {
  breakpoints: PropTypes.object,
  children: PropTypes.node,
  component: PropTypes.elementType,
  lazy: PropTypes.bool,
  src: PropTypes.string,
}

export default Media
