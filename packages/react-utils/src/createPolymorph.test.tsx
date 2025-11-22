import type { ComponentPropsWithRef, HTMLElementType, ReactNode } from 'react'
import { afterAll, afterEach, beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest'
import type { PolymorphicProps, PolymorphicRenderFunction } from './createPolymorph'

type PropOf<T, K extends PropertyKey> = K extends keyof T ? T[K] : never

describe('createPolymorph', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.doUnmock('react')
  })

  afterEach(() => {
    vi.doUnmock('react')
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  it('is a function', async () => {
    const { createPolymorph } = await import('./createPolymorph')
    expect(createPolymorph).toBeTypeOf('function')
  })

  it('returns passed reference-equal function', async () => {
    const { createPolymorph } = await import('./createPolymorph')

    const testFunction: PolymorphicRenderFunction<Record<string, unknown>, HTMLElementType> = () =>
      null
    expect(createPolymorph(testFunction)).toEqual(testFunction)
  })

  it('throws if React version is below 19', async () => {
    vi.doMock('react', async () => {
      const actual = await vi.importActual('react')
      return { ...actual, version: '18.2.0' }
    })
    const { createPolymorph } = await import('./createPolymorph')

    expect(() => createPolymorph(() => null)).toThrowError(
      'To use `createPolymorph`, please upgrade "react" and "@types/react" to version 19 or higher.',
    )
  })

  it('merges native props with custom props based on the active "as" element', async () => {
    const { createPolymorph } = await import('./createPolymorph')

    type CustomProps = { variant: 'primary' | 'ghost' }
    type ButtonProps = PolymorphicProps<CustomProps, 'button'>
    type AnchorProps = PolymorphicProps<CustomProps, 'a'>

    expectTypeOf<ButtonProps['as']>().toEqualTypeOf<'button' | undefined>()
    expectTypeOf<ButtonProps['variant']>().toEqualTypeOf<'primary' | 'ghost'>()
    expectTypeOf<ButtonProps['ref']>().toEqualTypeOf<ComponentPropsWithRef<'button'>['ref']>()
    expectTypeOf<AnchorProps['ref']>().toEqualTypeOf<ComponentPropsWithRef<'a'>['ref']>()
    expectTypeOf<AnchorProps['href']>().toEqualTypeOf<string | undefined>()

    const Button = createPolymorph<CustomProps, 'button'>(() => null)
    expect(Button({ variant: 'primary', type: 'button' })).toBeNull()
    expect(Button({ as: 'a', href: '#', variant: 'ghost' })).toBeNull()
  })

  it('honors omit config for custom and native props', async () => {
    const { createPolymorph } = await import('./createPolymorph')

    type CustomProps = { label: string; children?: ReactNode }
    type Config = { omit: 'children' | 'type' }
    type Props = PolymorphicProps<CustomProps, 'button', Config>
    expectTypeOf<Props['label']>().toEqualTypeOf<string>()
    expectTypeOf<PropOf<Props, 'children'>>().toBeNever()
    expectTypeOf<PropOf<Props, 'type'>>().toBeNever()

    const Button = createPolymorph<CustomProps, 'button', Config>(() => null)
    expect(Button({ label: 'CTA' })).toBeNull()
  })

  it('uses overrides config to narrow native props', async () => {
    const { createPolymorph } = await import('./createPolymorph')

    type Config = { overrides: { type: 'button' | 'submit' } }
    type Props = PolymorphicProps<{ id?: string }, 'button', Config>
    expectTypeOf<Props['type']>().toEqualTypeOf<'button' | 'submit'>()

    const Button = createPolymorph<{ id?: string }, 'button', Config>(() => null)
    expect(Button({ type: 'submit' })).toBeNull()
  })
})
