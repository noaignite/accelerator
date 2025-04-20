/* eslint-disable @typescript-eslint/no-explicit-any -- Allow for tests */
import { describe, expect, it, vi } from 'vitest'
import { typography } from './index'

describe('typography', () => {
  const theme = (path: string) => {
    if (path === 'screens.sm') return '640px'
    if (path === 'screens.md') return '768px'
    if (path === 'screens.lg') return '1024px'
    throw new Error(`Unexpected theme key: ${path}`)
  }

  it('generates non-responsive non-fluid typography', () => {
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

  it('generates responsive non-fluid typography', () => {
    // 1) Define options that use a responsive variant
    const options = {
      breakpointKeys: ['sm', 'md'] as const,
      prefix: 'type-',
      unit: 'px',
      variants: {
        title: {
          sm: { fontSize: 14, lineHeight: 1.5 },
          md: { fontSize: 20 },
        },
      },
    }

    // 2) Spy on addComponents, stub theme
    const addComponents = vi.fn()

    // 3) Extract the plugin object and invoke its handler
    const pluginObj = typography(options) as any
    pluginObj.handler({ addComponents, theme })

    // 4) Assert
    expect(addComponents).toHaveBeenCalledTimes(1)
    const result = addComponents.mock.calls[0]?.[0]

    expect(result).toHaveProperty('.type-title')
    expect(result['.type-title']).toMatchObject({
      fontSize: '14px',
      lineHeight: 1.5,
      [`@media (min-width: ${theme('screens.md')})`]: {
        fontSize: '20px',
      },
    })
  })

  it('generates responsive fluid typography without breakpoints', () => {
    // 1) Define options that use a responsive variant
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

    // 2) Spy on addComponents, stub theme
    const addComponents = vi.fn()

    // 3) Extract the plugin object and invoke its handler
    const pluginObj = typography(options) as any
    pluginObj.handler({ addComponents, theme })

    expect(addComponents).toHaveBeenCalledOnce()
    const result = addComponents.mock.calls[0]?.[0]

    // The base `.title` key should have the fluid calc()
    const base = result['.title']
    expect(base.fontSize).toContain('calc(')

    // Also non-responsive utilities `.title-sm` and `.title-md`
    expect(result['.title-sm'].fontSize).toBe('20px')
    expect(result['.title-md'].fontSize).toBe('30px')
  })

  it('generates responsive fluid typography with breakpoints', () => {
    // 1) Define options that use a responsive variant
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

    // 2) Spy on addComponents, stub theme
    const addComponents = vi.fn()

    // 3) Extract the plugin object and invoke its handler
    const pluginObj = typography(options) as any
    pluginObj.handler({ addComponents, theme })

    // 4) Assert
    expect(addComponents).toHaveBeenCalledOnce()
    const result = addComponents.mock.calls[0]?.[0]

    // The base `.title` key should have the fluid calc()
    expect(result['.title'].fontSize).toContain('calc(')
    // And there should be a media query for min-width:768px
    expect(result['.title']['@media (min-width: 768px)']).toBeDefined()

    // Also non-responsive utilities `.title-sm`, `.title-md` & `.title-lg`
    expect(result['.title-sm'].fontSize).toBe('20px')
    expect(result['.title-md'].fontSize).toBe('30px')
    expect(result['.title-lg'].fontSize).toBe('40px')
  })
})
