/**
 * React Swiper Wrapper
 *
 * Github: https://github.com/nolimits4web/swiper/
 * Demos: http://idangero.us/swiper/demos/
 * Docs: http://idangero.us/swiper/api/
 */

import * as React from 'react'
import PropTypes from 'prop-types'
import classnames from 'clsx'
import { useForkRef } from '@material-ui/core/utils'
import withStyles from '@material-ui/core/styles/withStyles'

export const styles = {
  root: {},
  wrapper: {},
  navigationDisabled: {
    opacity: 0.3,
    cursor: 'auto',
    pointerEvents: 'none',
  },
  navigationLocked: {
    display: 'none',
  },
  paginationLocked: {
    display: 'none',
  },
  scrollbarLocked: {
    display: 'none',
  },
}

const Rwiper = React.forwardRef(function Rwiper(props, ref) {
  const {
    activeSlide,
    children,
    classes,
    className,
    component: Component = 'div',
    disableTouchMove,
    init = true,
    modules,
    style,
    Swiper,
    ...other
  } = props

  const {
    navigation: navigationProp = {},
    pagination: paginationProp = {},
    scrollbar: scrollbarProp = {},
    on = {},
    ...more
  } = other

  const swiperRef = React.useRef(null)
  const rootRef = React.useRef(null)
  const handleRootRef = useForkRef(rootRef, ref)
  const navigationPrevRef = React.useRef(null)
  const navigationNextRef = React.useRef(null)
  const paginationRef = React.useRef(null)
  const scrollbarRef = React.useRef(null)

  React.useEffect(() => {
    console.error(
      [
        'Oakwood-UI: the `Rwiper` component is deprecated and will be removed in a future version.',
        'Upgrade to Swiper version 6 or higher and use the Swiper React components.',
      ].join('\n'),
    )

    if (!Swiper) {
      console.error(
        [
          'Oakwood-UI: the Rwiper component requires the Swiper instance to be passed as a prop.',
          'Import Swiper instance in your local project and pass as `Swiper={Swiper}`.',
        ].join('\n'),
      )
      return undefined
    }

    if (modules) {
      Swiper.use(modules)
    }

    const swiperProps = {
      init: false,
      ...more,
    }

    let navigationPrevEl = navigationPrevRef.current || navigationProp.prevEl
    if (navigationPrevEl != null && typeof navigationPrevEl === 'function') {
      navigationPrevEl = navigationPrevEl()
    }

    let navigationNextEl = navigationNextRef.current || navigationProp.nextEl
    if (navigationNextEl != null && typeof navigationNextEl === 'function') {
      navigationNextEl = navigationNextEl()
    }

    let paginationEl = paginationRef.current || paginationProp.el
    if (paginationEl != null && typeof paginationEl === 'function') {
      paginationEl = paginationEl()
    }

    let scrollbarEl = scrollbarRef.current || scrollbarProp.el
    if (scrollbarEl != null && typeof scrollbarEl === 'function') {
      scrollbarEl = scrollbarEl()
    }

    if (navigationPrevEl && navigationNextEl) {
      swiperProps.navigation = {
        ...navigationProp,
        disabledClass: classes.navigationDisabled,
        lockClass: classes.navigationLocked,
        prevEl: navigationPrevEl,
        nextEl: navigationNextEl,
      }
    }

    if (paginationEl) {
      swiperProps.pagination = {
        ...paginationProp,
        lockClass: classes.paginationLocked,
        el: paginationEl,
      }
    }

    if (scrollbarEl) {
      swiperProps.scrollbar = {
        ...scrollbarProp,
        lockClass: classes.scrollbarLocked,
        el: scrollbarEl,
      }
    }

    const swiper = new Swiper(rootRef.current, swiperProps)
    swiperRef.current = swiper

    // Patch Swiper events having no arguments with Swiper instance.
    Object.entries(on).forEach(([eventName, callback]) => {
      swiper.on(eventName, (...args) => (args.length ? callback(...args) : callback(swiper)))
    })

    return () => {
      swiperRef.current = null
      if (swiper.initialized) {
        swiper.destroy()
      }
    }

    // See Option 3. https://github.com/facebook/react/issues/14476#issuecomment-471199055
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(more)])

  React.useEffect(() => {
    const swiper = swiperRef.current
    if (swiper && !swiper.initialized && init) {
      swiper.init()
    }
  }, [init])

  React.useEffect(() => {
    const swiper = swiperRef.current
    if (swiper) {
      swiper.allowTouchMove = !disableTouchMove
    }
  }, [disableTouchMove])

  React.useEffect(() => {
    const swiper = swiperRef.current
    if (swiper && swiper.initialized && activeSlide != null) {
      swiper.slideTo(activeSlide)
    }
  }, [activeSlide])

  let navigationPrev = null
  if (React.isValidElement(navigationProp.prevEl)) {
    navigationPrev = React.cloneElement(navigationProp.prevEl, { ref: navigationPrevRef })
  }

  let navigationNext = null
  if (React.isValidElement(navigationProp.nextEl)) {
    navigationNext = React.cloneElement(navigationProp.nextEl, { ref: navigationNextRef })
  }

  let pagination = null
  if (React.isValidElement(paginationProp.el)) {
    pagination = React.cloneElement(paginationProp.el, { ref: paginationRef })
  }

  let scrollbar = null
  if (React.isValidElement(scrollbarProp.el)) {
    scrollbar = React.cloneElement(scrollbarProp.el, { ref: scrollbarRef })
  }

  return (
    <Component
      className={classnames('swiper-container', classes.root, className)}
      ref={handleRootRef}
      style={style}
    >
      <div className={classnames('swiper-wrapper', classes.wrapper)}>{children}</div>

      {navigationPrev}
      {navigationNext}
      {pagination}
      {scrollbar}
    </Component>
  )
})

Rwiper.propTypes = {
  activeSlide: PropTypes.number,
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  component: PropTypes.elementType,
  disableTouchMove: PropTypes.bool,
  init: PropTypes.bool,
  modules: PropTypes.array,
  style: PropTypes.object,
  Swiper: PropTypes.func,
}

Rwiper.uiName = 'OuiRwiper'

export default withStyles(styles, { name: 'OuiRwiper' })(Rwiper)
