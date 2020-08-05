// @inheritedComponent CardMedia

import * as React from 'react'
import PropTypes from 'prop-types'
import { chainPropTypes } from '@material-ui/utils'
import withStyles from '@material-ui/core/styles/withStyles'
import CardMedia from '@material-ui/core/CardMedia'
import MediaSources from './MediaSources'
import MediaWithWidth from './MediaWithWidth'

export const styles = {
  root: {},
  media: {
    // `CardMedia` doesn't stretch videos, patch it.
    objectFit: 'cover',
  },
  img: {
    // Complement `CardMedia` by styling child img's
    '& > img': {
      display: 'inherit',
      width: 'inherit',
      height: 'inherit',
      objectFit: 'inherit',
    },
  },
}

const IMG_ATTRIBUTES = ['alt', 'height', 'loading', 'sizes', 'src', 'srcSet', 'width']

/**
 * Separates the argument into two entries. First one containing attributes
 * which should be applied to `img`s, second one containing the remaining values.
 * @param {object} props
 * @return {array} [imgProps, restProps]
 */
export function imgAttrEntries(props) {
  return Object.keys(props).reduce(
    (acc, key) => {
      acc[Number(IMG_ATTRIBUTES.indexOf(key) === -1)][key] = props[key]
      return acc
    },
    [{}, {}],
  )
}

const Media = React.forwardRef(function Media(props, ref) {
  const { breakpoints, component, src, ...other } = props

  let componentProps = { ...other }
  let Component = CardMedia

  if (component === 'picture') {
    const [imgProps, restProps] = imgAttrEntries(other)
    componentProps = {
      children: <img src={src} alt="" {...imgProps} />,
      ...restProps,
    }
    if (breakpoints) {
      componentProps.children = React.Children.toArray(componentProps.children)
      componentProps.children.unshift(<MediaSources key="sources" breakpoints={breakpoints} />)
    }
  } else if (breakpoints) {
    componentProps.breakpoints = breakpoints
    Component = MediaWithWidth
  } else {
    componentProps.image = src
  }

  return <Component component={component} ref={ref} {...componentProps} />
})

Media.propTypes = {
  breakpoints: PropTypes.shape({
    xs: PropTypes.any.isRequired,
    sm: PropTypes.any,
    md: PropTypes.any,
    lg: PropTypes.any,
    xl: PropTypes.any,
  }),
  children: chainPropTypes(PropTypes.node, (props) => {
    if (!props.breakpoints && !props.children && !props.src) {
      return new Error('OUI: either `breakpoints`, `children` or `src` prop must be specified.')
    }
    return null
  }),
  classes: PropTypes.object.isRequired,
  component: PropTypes.elementType,
  src: PropTypes.string,
}

Media.uiName = 'OuiMedia'

export default withStyles(styles, { name: 'OuiMedia' })(Media)
