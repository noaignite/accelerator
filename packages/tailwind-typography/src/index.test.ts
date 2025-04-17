/* eslint-disable @typescript-eslint/no-explicit-any -- Allow for tests */
import { describe, expect, it, vi } from 'vitest'
import { fluidValue, typography } from './index'

describe('fluidValue helper', () => {
  it('generates the basic calc() formula when no clamping', () => {
    const result = fluidValue(16, 24, 640, 768, 'px', false, false)
    expect(result).toBe('calc(16px + 8 * ((100vw - 640px) / 128))')
  })

  it('wraps in clamp() when clampMin and clampMax are true', () => {
    const result = fluidValue(16, 24, 640, 768, 'px', true, true)
    expect(result).toBe('clamp(16px, calc(16px + 8 * ((100vw - 640px) / 128)), 24px)')
  })

  it('uses max() when only clampMin is true', () => {
    const result = fluidValue(12, 20, 320, 1024, 'rem', true, false)
    expect(result).toBe('max(12rem, calc(12rem + 8 * ((100vw - 320rem) / 704)))')
  })

  it('uses min() when only clampMax is true', () => {
    const result = fluidValue(12, 20, 320, 1024, 'rem', false, true)
    expect(result).toBe('min(20rem, calc(12rem + 8 * ((100vw - 320rem) / 704)))')
  })
})

describe('typography Tailwind plugin', () => {
  it('calls addComponents with correct flat variant for non-responsive plain object', () => {
    // 1) Define options that use a plain variant (no breakpoints)
    const options = {
      breakpointKeys: ['sm', 'md'] as const,
      prefix: 'type-',
      unit: 'px',
      variants: {
        body: {
          fontFamily: 'sans',
          fontSize: 14,
          fontWeight: 400,
          lineHeight: 1.5,
        },
      },
    }

    // 2) Spy on addComponents, stub theme
    const addComponents = vi.fn()
    const theme = (_path: string) => {
      // not used for plain variants
      return ''
    }

    // 3) Extract the plugin object and invoke its handler
    const pluginObj = typography(options) as any
    pluginObj.handler({ addComponents, theme })

    // 4) Assert
    expect(addComponents).toHaveBeenCalledTimes(1)
    const result = addComponents.mock.calls[0]?.[0]
    expect(result).toHaveProperty('.type-body')
    expect(result['.type-body']).toMatchObject({
      fontFamily: 'sans',
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.5,
    })
  })

  it('generates responsive fluid font-sizes between breakpoints without `@media` if only 2 breakpoint keys', () => {
    const options = {
      breakpointKeys: ['sm', 'md', 'lg'] as const,
      unit: 'px',
      fluid: true,
      variants: {
        title: {
          sm: { fontSize: 20, lineHeight: 1.2 },
          md: { fontSize: 30 },
        },
      },
    }

    const addComponents = vi.fn()
    const theme = (path: string) => {
      if (path === 'screens.sm') return '640px'
      if (path === 'screens.md') return '768px'
      throw new Error(`Unexpected theme key: ${path}`)
    }

    const pluginObj = typography(options) as any
    pluginObj.handler({ addComponents, theme })

    expect(addComponents).toHaveBeenCalledOnce()
    const generated = addComponents.mock.calls[0]?.[0]

    // The base `.title` key should have the fluid calc()
    const base = generated['.title']
    expect(base.fontSize).toContain('calc(')

    // Also non-responsive utilities `.title-sm` and `.title-md`
    expect(generated['.title-sm'].fontSize).toBe('20px')
    expect(generated['.title-md'].fontSize).toBe('30px')
  })

  it('generates responsive fluid font-sizes between breakpoints with `@media` if at least 3 breakpoint keys', () => {
    const options = {
      breakpointKeys: ['sm', 'md', 'lg'] as const,
      unit: 'px',
      fluid: true,
      variants: {
        title: {
          sm: { fontSize: 20, lineHeight: 1.2 },
          md: { fontSize: 30 },
          lg: { fontSize: 40 },
        },
      },
    }

    const addComponents = vi.fn()
    const theme = (path: string) => {
      if (path === 'screens.sm') return '640px'
      if (path === 'screens.md') return '768px'
      if (path === 'screens.lg') return '1024px'
      throw new Error(`Unexpected theme key: ${path}`)
    }

    const pluginObj = typography(options) as any
    pluginObj.handler({ addComponents, theme })

    expect(addComponents).toHaveBeenCalledOnce()
    const generated = addComponents.mock.calls[0]?.[0]

    // The base `.title` key should have the fluid calc()
    const base = generated['.title']
    expect(base.fontSize).toContain('calc(')
    // And there should be a media query for min-width:768px
    expect(generated['.title']['@media (min-width: 768px)']).toBeDefined()

    // Also non-responsive utilities `.title-sm`, `.title-md` & `.title-lg`
    expect(generated['.title-sm'].fontSize).toBe('20px')
    expect(generated['.title-md'].fontSize).toBe('30px')
    expect(generated['.title-lg'].fontSize).toBe('40px')
  })
})
