import plugin from 'tailwindcss/plugin'

// NOTE: Should this helper perhaps be moved to `@noaignite/utils`?
function isPlainObject(x: unknown): x is Record<string, unknown> {
  return (
    typeof x === 'object' &&
    x?.constructor === Object &&
    Object.getPrototypeOf(x) === Object.prototype
  )
}

// NOTE: Should this helper perhaps be moved to `@noaignite/utils`?
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
    return `min(${minValue}${unit}, ${value})`
  }
  return value
}

export interface TypographyOptionsVariant {
  fontSize: number
  [key: string]: string | number
}

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

export type TypographyOptionsVariants<TKeys extends readonly [string, ...string[]]> = Record<
  string,
  TypographyOptionsVariant | TypographyOptionsVariantMap<TKeys>
>

export type TypographyReturnVariant = Record<string, string | number>
export type TypographyReturnVariantMap = Record<string, TypographyReturnVariant>
export type TypographyReturnVariants = Record<
  string,
  TypographyReturnVariant | TypographyReturnVariantMap
>

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
