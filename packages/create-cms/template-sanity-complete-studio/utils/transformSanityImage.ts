import { breakpoints as themeBreakpoints } from '.'
import buildImageUrl from './buildImageUrl'

const DEFAULT_OPTIONS = {
  xs: { width: 390, dpr: 2 }, // Based on iPhone 14 Pro.
  sm: { width: themeBreakpoints.values.sm },
  md: { width: themeBreakpoints.values.md, dpr: 1 },
  lg: { width: themeBreakpoints.values.lg },
  xl: { width: themeBreakpoints.values.xl },
}

export default function transformSanityImage(sanityMedia, options = {}) {
  const entries = Object.entries(DEFAULT_OPTIONS).reduce((acc, [key, breakpointOptions]) => {
    const image = sanityMedia.auto ? sanityMedia.breakpoints.xs : sanityMedia.breakpoints[key]

    if (!image) {
      return acc
    }

    // TODO: This might lead to unwanted behaviour as it will always result in a value being set for 'width'.
    // We might want to ignore certain default settings if overrides are provided.
    const url = buildImageUrl(image, {
      ...breakpointOptions,
      ...options[key],
    })

    acc.push([key, url])

    return acc
  }, [])

  return {
    component: 'picture',
    alt: sanityMedia.alt || '',
    breakpoints: Object.fromEntries(entries),
  }
}
