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
  const { breakpoints, component = 'img', priority, src, ...other } = props

  const [lazy, setLazy] = React.useState(!priority)
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

  if (!priority) {
    return (
      <InView
        ContainerComponent={ContainerComponent}
        component={component}
        lazy={lazy}
        onEnter={handleEnter}
        rootMargin="256px" // Value based on: https://web.dev/lazy-loading-best-practices/
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
  lazy: (props) => {
    if (props.lazy) {
      throw new Error(
        'Oakwood-UI: `lazy` was deprecated. Lazy loading is now enabled per ' +
          'default, use `priority` instead to opt-out.',
      )
    }
  },
  priority: PropTypes.bool,
  src: PropTypes.string,
}

export default Media
