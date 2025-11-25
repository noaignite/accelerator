import { type ComponentPropsWithRef, type HTMLElementType, type ReactNode } from 'react'
import { afterAll, afterEach, beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest'
import type { PolymorphicProps, PolymorphicRenderFunction } from './createPolymorph'

/**
 * Extracts the type of a property `K` from object type `T`.
 *
 * This is a safe lookup utility: if `K` is not a key of `T`,
 * the resulting type is `never` rather than causing an error.
 *
 * @example
 * ```tsx
 * type Example = { foo: string; bar: number }
 *
 * type FooType = PropOf<Example, 'foo'> // string
 * type BazType = PropOf<Example, 'baz'> // never
 * ```
 */
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

  it('constrains `as` defaults to the declared prop shape when present on custom props', async () => {
    const { createPolymorph } = await import('./createPolymorph')

    type CustomProps = { as?: 'a' | 'button'; label: string }

    const LinkOrButton = createPolymorph<CustomProps, 'button'>(() => null)

    expect(LinkOrButton({ as: 'a', href: '#', label: 'CTA' })).toBeNull()
    expect(LinkOrButton({ as: 'button', label: 'CTA' })).toBeNull()
    // @ts-expect-error -- `as` should be constrained to the union declared on P.
    expect(LinkOrButton({ as: 'span', label: 'CTA' })).toBeNull()
  })

  it('merges native props with custom props based on the active `as` element', async () => {
    const { createPolymorph } = await import('./createPolymorph')

    type CustomProps = { variant: 'primary' | 'ghost' }
    type ButtonProps = PolymorphicProps<CustomProps, 'button'>
    type AnchorProps = PolymorphicProps<CustomProps, 'a'>

    expectTypeOf<ButtonProps['as']>().toEqualTypeOf<'button' | undefined>()
    expectTypeOf<ButtonProps['variant']>().toEqualTypeOf<'primary' | 'ghost'>()
    expectTypeOf<AnchorProps['href']>().toEqualTypeOf<string | undefined>()

    const Button = createPolymorph<CustomProps, 'button'>(() => null)
    expect(Button({ variant: 'primary', type: 'button' })).toBeNull()
    expect(Button({ as: 'a', href: '#', variant: 'ghost' })).toBeNull()
  })

  it('prefers custom props when they clash with native attributes', async () => {
    const { createPolymorph } = await import('./createPolymorph')

    type CustomProps = { className?: number }
    type ButtonProps = PolymorphicProps<CustomProps, 'button'>

    expectTypeOf<ButtonProps['className']>().toEqualTypeOf<number | undefined>()

    const Button = createPolymorph<CustomProps, 'button'>(() => null)
    expect(Button({ className: 123 })).toBeNull()
    // @ts-expect-error -- CustomProps overrides native `className` string type.
    expect(Button({ className: 'primary' })).toBeNull()
  })

  it('restricts render function props to attributes of the base element', async () => {
    const { createPolymorph } = await import('./createPolymorph')

    type CustomProps = { variant: 'primary' | 'ghost' }

    createPolymorph<CustomProps, 'button'>((props) => {
      expectTypeOf(props.as).toEqualTypeOf<'button' | undefined>()
      expectTypeOf(props.type).toEqualTypeOf<ComponentPropsWithRef<'button'>['type']>()
      expectTypeOf(props.disabled).toEqualTypeOf<ComponentPropsWithRef<'button'>['disabled']>()

      expectTypeOf<PropOf<typeof props, 'checked'>>().toBeNever()
      expectTypeOf<PropOf<typeof props, 'href'>>().toBeNever()
      return null
    })
  })

  it('infers correct `ref` type when extracted inside render function', async () => {
    const { createPolymorph } = await import('./createPolymorph')

    type CustomProps = { label: string }

    createPolymorph<CustomProps, 'button'>(({ ref }) => {
      expectTypeOf(ref).toEqualTypeOf<ComponentPropsWithRef<'button'>['ref']>()
      return null
    })
  })

  it('exposes correct `ref` types to consumers', async () => {
    const { createPolymorph } = await import('./createPolymorph')

    type CustomProps = { label: string }
    const Button = createPolymorph<CustomProps, 'button'>(() => null)

    const buttonRef: ComponentPropsWithRef<'button'>['ref'] = () => undefined
    const anchorRef: ComponentPropsWithRef<'a'>['ref'] = () => undefined

    expect(Button({ label: 'CTA', ref: buttonRef })).toBeNull()
    // @ts-expect-error -- base button cannot accept anchor refs.
    expect(Button({ label: 'CTA', ref: anchorRef })).toBeNull()
    expect(Button({ as: 'a', href: '#', label: 'CTA', ref: anchorRef })).toBeNull()
  })

  it('exposes correct `ref` types when `as` targets a polymorphic component', async () => {
    const { createPolymorph } = await import('./createPolymorph')

    type LinkProps = { label: string }
    type LinkConfig = { overrides: { href: string } }
    const Link = createPolymorph<LinkProps, 'a', LinkConfig>(() => null)

    const Trigger = createPolymorph<{ label: string }, 'button'>(() => null)

    const anchorRef: ComponentPropsWithRef<'a'>['ref'] = () => undefined
    expect(Trigger({ as: Link, href: '#', label: 'CTA', ref: anchorRef })).toBeNull()
  })

  it('honors `omit` config for custom and native props', async () => {
    const { createPolymorph } = await import('./createPolymorph')

    type CustomProps = { label: string; children?: ReactNode }
    type Config = { omit: 'children' | 'type' }
    type Props = PolymorphicProps<CustomProps, 'button', Config>

    expectTypeOf<Props['label']>().toEqualTypeOf<string>()
    expectTypeOf<PropOf<Props, 'children'>>().toBeNever()
    expectTypeOf<PropOf<Props, 'type'>>().toBeNever()

    const Button = createPolymorph<CustomProps, 'button', Config>(() => null)
    expect(Button({ label: 'CTA' })).toBeNull()
    // @ts-expect-error -- `children` should be invalid.
    expect(Button({ children: 'CTA' })).toBeNull()
    // @ts-expect-error -- `type` should be invalid.
    expect(Button({ type: 'button' })).toBeNull()
  })

  it('honors `omit` config when using a custom component via `as`', async () => {
    const { createPolymorph } = await import('./createPolymorph')

    type ButtonProps = { children: ReactNode }
    const Button = createPolymorph<ButtonProps, 'button'>(({ children }) => {
      expectTypeOf(children).toEqualTypeOf<ReactNode>()
      return null
    })

    type RadioProps = { checked?: boolean }
    type RadioConfig = { omit: 'children' }

    type RadioButtonProps = PolymorphicProps<RadioProps, typeof Button, RadioConfig>
    expectTypeOf<PropOf<RadioButtonProps, 'children'>>().toBeNever()

    const Radio = createPolymorph<RadioProps, 'input', RadioConfig>(() => null)
    expect(Radio({ as: Button, checked: true })).toBeNull()
    // @ts-expect-error -- `children` is omitted even when using a custom component that accepts it.
    expect(Radio({ as: Button, children: 'Hello world' })).toBeNull()
  })

  it('propagates `omit` through nested polymorphic `as` components', async () => {
    const { createPolymorph } = await import('./createPolymorph')

    type ButtonProps = { label: string; onClick?: () => void }
    type ButtonConfig = { omit: 'onClick' }
    const Button = createPolymorph<ButtonProps, 'button', ButtonConfig>(() => null)

    type ToggleProps = { label: string }
    type TogglePolymorph = PolymorphicProps<ToggleProps, typeof Button>
    expectTypeOf<PropOf<TogglePolymorph, 'onClick'>>().toBeNever()

    const Toggle = createPolymorph<ToggleProps, 'div'>(() => null)
    expect(Toggle({ as: Button, label: 'Toggle' })).toBeNull()
    // @ts-expect-error -- `onClick` was omitted on the nested polymorph.
    expect(Toggle({ as: Button, label: 'Toggle', onClick: () => undefined })).toBeNull()
  })

  it('uses `overrides` config to narrow native props', async () => {
    const { createPolymorph } = await import('./createPolymorph')

    type CustomProps = { id?: string }
    type Config = { overrides: { type: 'button' | 'submit' } }
    type Props = PolymorphicProps<CustomProps, 'button', Config>

    expectTypeOf<Props['type']>().toEqualTypeOf<'button' | 'submit'>()

    const Button = createPolymorph<CustomProps, 'button', Config>(() => null)
    expect(Button({ type: 'submit' })).toBeNull()
    // @ts-expect-error -- `type="reset"` should be invalid.
    expect(Button({ type: 'reset' })).toBeNull()
  })

  it('rejects `overrides` for native props that do not exist', async () => {
    const { createPolymorph } = await import('./createPolymorph')

    type CustomProps = { label: string }
    type BadConfig = { overrides: { foo: string } }

    // @ts-expect-error -- Overrides must target existing native props of the base element.
    const Button = createPolymorph<CustomProps, 'button', BadConfig>(() => null)
    expect(Button({ label: 'bar' })).toBeNull()
    // @ts-expect-error -- `foo` is invalid as it does not exist on base element.
    expect(Button({ foo: 'baz' })).toBeNull()
  })

  it('propagates `overrides` through nested polymorphic `as` components', async () => {
    const { createPolymorph } = await import('./createPolymorph')

    type LinkProps = { label: string }
    type LinkConfig = { overrides: { href: string } }
    const Link = createPolymorph<LinkProps, 'a', LinkConfig>(() => null)

    type TriggerProps = { label: string }
    type TriggerPolymorph = PolymorphicProps<TriggerProps, typeof Link>
    expectTypeOf<TriggerPolymorph['href']>().toEqualTypeOf<string>()

    const Trigger = createPolymorph<TriggerProps, 'button'>(() => null)
    expect(Trigger({ as: Link, href: '/home', label: 'Go' })).toBeNull()
    // @ts-expect-error -- `href` is required when using the Link polymorph.
    expect(Trigger({ as: Link, label: 'Go' })).toBeNull()
    // @ts-expect-error -- `href` must match the narrowed override type.
    expect(Trigger({ as: Link, href: 123, label: 'Go' })).toBeNull()
  })

  it('prefers custom props over `overrides` when keys clash', async () => {
    const { createPolymorph } = await import('./createPolymorph')

    type CustomProps = { type?: 'primary' }
    type Config = { overrides: { type: 'button' | 'submit' } }
    type Props = PolymorphicProps<CustomProps, 'button', Config>

    expectTypeOf<Props['type']>().toEqualTypeOf<'primary' | undefined>()

    const Button = createPolymorph<CustomProps, 'button', Config>(() => null)
    expect(Button({ type: 'primary' })).toBeNull()
    // @ts-expect-error -- override should not replace the custom prop definition.
    expect(Button({ type: 'button' })).toBeNull()
  })

  it('applies `overrides` and `omit` for the base element and custom `as` values', async () => {
    const { createPolymorph } = await import('./createPolymorph')

    type CustomProps = { label: string; disabled?: boolean; children?: ReactNode }
    type Config = { overrides: { type: 'button' }; omit: 'disabled' | 'children' }

    type ButtonProps = PolymorphicProps<CustomProps, 'button', Config>
    type AnchorProps = PolymorphicProps<CustomProps, 'a', Config>

    expectTypeOf<ButtonProps['type']>().toEqualTypeOf<'button'>()
    expectTypeOf<PropOf<ButtonProps, 'disabled'>>().toBeNever()
    expectTypeOf<PropOf<AnchorProps, 'type'>>().toEqualTypeOf<'button'>()
    expectTypeOf<PropOf<AnchorProps, 'children'>>().toBeNever()

    const Button = createPolymorph<CustomProps, 'button', Config>(() => null)
    expect(Button({ label: 'CTA', type: 'button' })).toBeNull()
    expect(Button({ as: 'a', href: '#', label: 'CTA', type: 'button' })).toBeNull()
    // @ts-expect-error -- `children` should be invalid.
    expect(Button({ label: 'CTA', children: 'CTA' })).toBeNull()
    // @ts-expect-error -- `type="reset"` should be invalid.
    expect(Button({ label: 'CTA', type: 'reset' })).toBeNull()
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
})
