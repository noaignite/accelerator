/* eslint-disable tsdoc/syntax -- Allow dot-notated @param's, seems to work. */

import { isPlainObject } from '@noaignite/utils'
import plugin from 'tailwindcss/plugin'

/**
 * Generates a fluid value based on the given parameters.
 *
 * @param minValue - The minimum value for the property (at the smallest viewport).
 * @param maxValue - The maximum value for the property (at the largest viewport).
 * @param minViewport - The minimum viewport width where the fluid value starts.
 * @param maxViewport - The maximum viewport width where the fluid value ends.
 * @param unit - The unit of the values (default is 'px').
 * @param clampMin - Whether to clamp the value at the minimum.
 * @param clampMax - Whether to clamp the value at the maximum.
 * @returns A string containing the CSS `calc` or `clamp` formula for the fluid value.
 */
export function fluidValue(
  minValue: number,
  maxValue: number,
  minViewport: number,
  maxViewport: number,
  unit = 'px',
  clampMin = false,
  clampMax = false,
) {
  // Set up the fluid formula.
  const deltaValue = maxValue - minValue
  const deltaViewport = maxViewport - minViewport
  const value = `calc(${minValue}${unit} + ${deltaValue} * ((100vw - ${minViewport}${unit}) / ${deltaViewport}))`

  // Clamp fontSize values if enabled.
  if (clampMin && clampMax) {
    return `clamp(${minValue}${unit}, ${value}, ${maxValue}${unit})`
  }
  if (clampMin) {
    return `max(${minValue}${unit}, ${value})`
  }
  if (clampMax) {
    return `min(${maxValue}${unit}, ${value})`
  }
  return value
}

/**
 * Interface representing the properties of a typography variant.
 */
export interface TypographyOptionsVariant {
  fontSize: number
  [key: string]: string | number
}

/**
 * Interface representing a typography variant map.
 */
export type TypographyOptionsVariantMap<TKeys extends readonly [string, ...string[]]> = {
  clamp?: boolean
  clampMax?: boolean
  clampMin?: boolean
  fluid?: boolean
} & {
  // All breakpoints are optional except the first one (`TKeys[0]]`).
  [key in TKeys[number]]?: TypographyOptionsVariant
} & {
  [key in TKeys[0]]-?: TypographyOptionsVariant
}

/**
 * Type representing a collection of typography variants.
 */
export type TypographyOptionsVariants<TKeys extends readonly [string, ...string[]]> = Record<
  string,
  TypographyOptionsVariant | TypographyOptionsVariantMap<TKeys>
>

/**
 * Type representing a returned typography variant, which can include various
 * properties like font size.
 */
export type TypographyReturnVariant = Record<string, string | number>

/**
 * Type representing a returned typography variant map with responsive properties.
 */
export type TypographyReturnVariantMap = Record<string, TypographyReturnVariant>

/**
 * Type representing the final returned set of typography variants.
 */
export type TypographyReturnVariants = Record<
  string,
  TypographyReturnVariant | TypographyReturnVariantMap
>

/**
 * Interface for the typography options used to configure the plugin.
 */
export interface TypographyOptions<TKeys extends readonly [string, ...string[]]> {
  breakpointKeys: TKeys
  clamp?: boolean
  clampMax?: boolean
  clampMin?: boolean
  fluid?: boolean
  prefix?: string
  unit?: string
  variants: TypographyOptionsVariants<TKeys>
}

/**
 * Tailwind CSS plugin for generating responsive and fluid typography variant
 * class names based on specified options.
 *
 * @param options - Configuration options for the typography plugin.
 * @param options.breakpointKeys - An array of breakpoints
 * (e.g., `['sm', 'md', 'lg']`). The first breakpoint is required for all
 * variants, and additional breakpoints are optional.
 * @param options.clamp - A global flag to enable or disable clamping across
 * all variants. Clamping restricts the font size to a minimum and maximum
 * value, preventing it from growing or shrinking too much. Defaults to `false`.
 * @param options.clampMax - A global flag to enable or disable clamping at the
 * maximum font size. If `true`, the font size will not exceed the maximum
 * value. This can be overridden per variant. Defaults to `options.clamp` value.
 * @param options.clampMin - A global flag to enable or disable clamping at the
 * minimum font size. If `true`, the font size will not fall below the minimum
 * value. This can be overridden per variant. Defaults to `options.clamp` value.
 * @param options.fluid - A global flag to enable or disable fluid typography
 * across all breakpoints. Fluid typography adjusts font sizes between
 * breakpoints. This can be overridden per variant. Defaults to `false`.
 * @param options.prefix - A string to prefix all generated class names with.
 * For example, if `prefix` is set to `'type-'`, the generated class names
 * would look like `.type-variantName`.
 * @param options.unit - The unit to be used for font size values, such as
 * `px`, `rem`, or `em`. Defaults to `px`.
 * @param options.variants - An object mapping variant names to either a single
 * typography variant or a variant map. Each variant may contain
 * breakpoint-specific styles (e.g., `{ sm: { fontSize: 16 }, md: { fontSize: 20 } }`),
 * along with optional local `clamp`, `clampMax`, `clampMin`, and `fluid` flags.
 * @returns A Tailwind CSS plugin function that registers the typography styles.
 *
 * @example
 * ```ts
 * tailwind({
 *   breakpointKeys: ['xs', 'md', 'xl'] as const,
 *   prefix: 'type-' as const,
 *   unit: 'rem',
 *   fluid: true,
 *   variants: {
 *     h1: {
 *       xs: {
 *         fontFamily: 'var(--font-primary)',
 *         fontSize: 48,
 *         fontWeight: 700,
 *         lineHeight: 1.2,
 *         textTransform: 'uppercase',
 *       },
 *       md: { fontSize: 72 },
 *     },
 *     body1: {
 *       fontFamily: 'var(--font-secondary)',
 *       fontSize: 14,
 *       fontWeight: 400,
 *       lineHeight: 1.2,
 *     },
 *   },
 * })
 * ```
 */
export function typography<TKeys extends readonly [string, ...string[]]>(
  options: TypographyOptions<TKeys>,
) {
  const {
    breakpointKeys,
    clamp: globalClamp = false,
    clampMax: globalClampMax,
    clampMin: globalClampMin,
    fluid: globalFluid = false,
    prefix = '',
    unit = 'px',
    variants: variantsProp,
  } = options

  const isPlainVariant = (x: unknown): x is TypographyOptionsVariant =>
    isPlainObject(x) && !(breakpointKeys[0] in x)

  return plugin(({ addComponents, theme }) => {
    const variants = Object.entries(variantsProp).reduce<TypographyReturnVariants>(
      (acc, [variantNameProp, variantOrMap]) => {
        // Compose the combined variant name.
        const variantName = `.${prefix}${variantNameProp}`

        // Compose the non-responsive variant.
        if (isPlainVariant(variantOrMap)) {
          const fontSize = `${variantOrMap.fontSize}${unit}`
          acc[variantName] = { ...variantOrMap, fontSize }

          return acc
        }

        const filteredBreakpointKeys = breakpointKeys.filter((key: TKeys[number]) =>
          Boolean(variantOrMap[key]),
        )

        const getNextBreakpointKey = (key: TKeys[number]) => {
          const index = filteredBreakpointKeys.indexOf(key)
          return index !== -1 ? filteredBreakpointKeys[index + 1] : undefined
        }

        const {
          clamp = globalClamp,
          clampMax = globalClampMax ?? clamp,
          clampMin = globalClampMin ?? clamp,
          fluid = globalFluid,
        } = variantOrMap
        const firstBreakpointKey: TKeys[0] = breakpointKeys[0]
        const firstVariant = variantOrMap[firstBreakpointKey]

        // Compose the responsive variant map.
        filteredBreakpointKeys.forEach((breakpoint: TKeys[number], idx) => {
          const variant = variantOrMap[breakpoint]
          const width: string = theme(`screens.${breakpoint}`)
          const media = `@media (min-width: ${width})`

          if (!fluid) {
            const fontSize = `${variant.fontSize}${unit}`
            const variantStyles = acc[variantName]

            if (idx === 0) {
              acc[variantName] = { ...variant, fontSize }
            } else if (variantStyles) {
              variantStyles[media] = { ...variant, fontSize }
            }
          }

          const nextBreakpoint: TKeys[number] | undefined = getNextBreakpointKey(breakpoint)
          const nextVariant = nextBreakpoint ? variantOrMap[nextBreakpoint] : null
          if (fluid && nextVariant) {
            const nextWidth: string = theme(`screens.${nextBreakpoint}`)

            const minFontSize = variant.fontSize
            const maxFontSize = nextVariant.fontSize
            const minViewport = parseInt(width, 10)
            const maxViewport = parseInt(nextWidth, 10)

            const fontSize = fluidValue(
              minFontSize,
              maxFontSize,
              minViewport,
              maxViewport,
              unit,
              clampMin,
              clampMax,
            )
            const variantStyles = acc[variantName]

            if (idx === 0) {
              acc[variantName] = { ...variant, fontSize }
            } else if (variantStyles) {
              variantStyles[media] = { ...variant, fontSize }
            }
          }

          // Compose the non-responsive breakpoint variants by merging with the "default" breakpoint.
          const fontSize = `${variant.fontSize}${unit}`
          acc[`${variantName}-${breakpoint}`] = {
            ...firstVariant,
            ...variant,
            fontSize,
          }
        })

        return acc
      },
      {},
    )

    // @ts-expect-error -- Also allow `number` as a type.
    addComponents(variants)
  })
}
