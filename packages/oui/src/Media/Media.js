// @inheritedComponent MediaBase

import * as React from 'react'
import PropTypes from 'prop-types'
import { InView } from 'react-intersection-observer'
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
  const { breakpoints, loading, src, ...other } = props

  const [lazy, setLazy] = React.useState(loading === 'lazy')
  const handleIntersectionChange = React.useCallback((inView) => {
    if (inView) {
      setLazy(false)
    }
  }, [])

  let componentProps = { ...other }
  let Component = MediaBase

  let ContainerComponent = null
  if (loading === 'lazy') {
    componentProps.onChange = handleIntersectionChange
    componentProps.triggerOnce = true
    ContainerComponent = InView
  }

  if (componentProps.component === 'picture') {
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
    Component = MediaWithWidth
  } else {
    componentProps.src = src
  }

  if (ContainerComponent) {
    return <ContainerComponent as={Component} lazy={lazy} ref={ref} {...componentProps} />
  }

  return <Component ref={ref} {...componentProps} />
})

Media.propTypes = {
  breakpoints: PropTypes.object,
  children: PropTypes.node,
  loading: PropTypes.string,
  src: PropTypes.string,
}

export default Media
