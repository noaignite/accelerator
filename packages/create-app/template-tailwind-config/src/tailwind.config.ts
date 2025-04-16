import { typography as tailwindTypography } from '@noaignite/tailwind-typography'
import type { Config } from 'tailwindcss'
import { breakpoints } from './breakpoints'
import { palette } from './palette'
import { typography } from './typography'

const config: Config = {
  content: [
    // App content
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    // Include packages if not transpiling
    '../../packages/*/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-color-scheme="dark"]'],
  theme: {
    fontFamily: {
      primary: 'var(--font-primary)',
      secondary: 'var(--font-secondary)',
    },
    screens: {
      // Generate the system breakpoints.
      ...Object.entries(breakpoints.values).reduce(
        (acc, [key, value]) => ({ ...acc, [key]: `${value}rem` }),
        {},
      ),
    },
    colors: {
      ...palette,
      // Native CSS colors.
      transparent: 'transparent',
      current: 'currentColor',
    },
    extend: {
      gridTemplateColumns: {
        0: '0fr', // Useful for animating from 0px to auto width.
        1: '1fr', // Useful for animating from 0px to auto width.
      },
      gridTemplateRows: {
        0: '0fr', // Useful for animating from 0px to auto height.
        1: '1fr', // Useful for animating from 0px to auto height.
      },
      spacing: {
        // Basic grid tokens.
        'grid-col-count': 'var(--spacing-grid-col-count)',
        'grid-gap': 'var(--spacing-grid-gap)',
        'grid-margin': 'var(--spacing-grid-margin)',
        // Common reusable system heights.
        'toolbar-height': 'var(--spacing-toolbar-height)',
        'statusbar-height': 'var(--spacing-statusbar-height)',
        'navbar-height': 'var(--spacing-navbar-height)',
        'header-height': 'var(--spacing-header-height)',
        // The most recurring vertical spacing between blocks.
        'block-margin': 'var(--spacing-block-margin)',
      },
      transitionDuration: {
        DEFAULT: 'var(--transition-duration-default)',
      },
    },
  },
  plugins: [tailwindTypography(typography)],
}

export default config
