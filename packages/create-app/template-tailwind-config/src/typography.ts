import type { TypographyOptions } from '@noaignite/tailwind-typography'
import { breakpoints } from './breakpoints'
import { pxToRem } from './utils'

export const typography = {
  breakpointKeys: breakpoints.keys,
  prefix: 'type-' as const,
  unit: 'rem',
  variants: {
    h1: {
      xs: {
        fontFamily: 'var(--font-primary)',
        fontSize: pxToRem(48),
        fontWeight: 700,
        lineHeight: 1.2,
        textTransform: 'uppercase',
      },
      md: { fontSize: pxToRem(72) },
    },
    body1: {
      fontFamily: 'var(--font-secondary)',
      fontSize: pxToRem(14),
      fontWeight: 400,
      lineHeight: 1.2,
    },
  },
} satisfies TypographyOptions<typeof breakpoints.keys>
