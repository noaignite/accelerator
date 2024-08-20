import {
  forwardRef,
  memo,
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  type ReactNode,
} from 'react'

/**
 * Create a new SVG icon component.
 *
 * @param path - The SVG path to render.
 * @param displayName - The display name of the icon.
 * @param viewBox - The viewBox of the SVG.
 * @param rest - Additional props to pass to the SVG element.
 * @returns A new SVG icon component.
 *
 * @example
 * ```tsx
 * export const AddIcon = createSvgIcon(
 *   <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" />,
 *   'Add',
 * );
 * ```
 */
export function createSvgIcon(
  path: ReactNode,
  displayName: string,
  viewBox = '0 0 24 24',
  rest?: ComponentPropsWithoutRef<'svg'>,
) {
  function SvgIcon(props: ComponentPropsWithoutRef<'svg'>, ref: ForwardedRef<SVGSVGElement>) {
    const { 'aria-label': ariaLabel, children = path, ...more } = props

    return (
      <svg
        aria-hidden={ariaLabel ? undefined : true}
        aria-label={ariaLabel}
        focusable="false"
        ref={ref}
        role={ariaLabel ? 'img' : undefined}
        viewBox={viewBox}
        {...rest}
        {...more}
      >
        {children}
      </svg>
    )
  }

  if (process.env.NODE_ENV !== 'production') {
    // Need to set `displayName` on the inner component for React.memo.
    // React prior to 16.14 ignores `displayName` on the wrapper.
    SvgIcon.displayName = `${displayName}Icon`
  }

  return memo(forwardRef(SvgIcon))
}
