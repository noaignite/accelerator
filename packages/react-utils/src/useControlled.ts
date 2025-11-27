// @see https://github.com/mui/material-ui/blob/master/packages/mui-utils/src/useControlled
/* eslint-disable react-hooks/rules-of-hooks, react-hooks/exhaustive-deps -- Based on Mui */
/* eslint-disable tsdoc/syntax -- Allow documentation of object params */

'use client'

import { type Dispatch, type SetStateAction, useCallback, useEffect, useRef, useState } from 'react'

export type UseControlledOptions<T = unknown> = {
  /**
   * Holds the component value when it's controlled.
   */
  controlled: T | undefined
  /**
   * The default value when uncontrolled.
   */
  default: T | undefined
  /**
   * The component name displayed in warnings.
   */
  name: string
  /**
   * The name of the state variable displayed in warnings.
   */
  state?: string
}

/**
 * A React hook to manage controlled versus uncontrolled state for a component.
 *
 * This hook encapsulates the logic required to allow a component to work either in a
 * controlled mode (where the parent component manages the state) or in an uncontrolled mode
 * (where the component itself manages the state).
 *
 * @param options - The hook options.
 * @param options.controlled - The controlled value; if defined, the component is controlled.
 * @param options.default - The initial default value when uncontrolled (used only on first render).
 * @param options.name - The component name for warning messages.
 * @param options.state - (Optional) The state variable name (defaults to "value") for warnings.
 * @returns A tuple with the current value and a setter. In controlled mode, the setter is a no-op.
 *
 * @example
 * ```tsx
 * function ExampleComponent(props) {
 *   const { value: valueProp, defaultValue, children } = props
 *
 *   const [value, setValue] = useControlled({
 *     controlled: valueProp,
 *     default: defaultValue,
 *     name: 'ExampleComponent',
 *   })
 *
 *   // ...
 * }
 * ```
 */
export function useControlled<T = unknown>(
  options: UseControlledOptions<T>,
): [T, Dispatch<SetStateAction<T | undefined>>] {
  const { controlled, default: defaultProp, name, state = 'value' } = options

  // isControlled is ignored in the hook dependency lists as it should never change.
  const { current: isControlled } = useRef(controlled !== undefined)
  const [valueState, setValueState] = useState(defaultProp)
  const value = isControlled ? controlled : valueState

  if (process.env.NODE_ENV !== 'production') {
    useEffect(() => {
      if (isControlled !== (controlled !== undefined)) {
        console.error(
          [
            `A component is changing the ${
              isControlled ? '' : 'un'
            }controlled ${state} state of ${name} to be ${isControlled ? 'un' : ''}controlled.`,
            'Elements should not switch from uncontrolled to controlled (or vice versa).',
            `Decide between using a controlled or uncontrolled ${name} ` +
              'element for the lifetime of the component.',
            "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.",
            'More info: https://fb.me/react-controlled-components',
          ].join('\n'),
        )
      }
    }, [state, name, controlled])

    const { current: defaultValue } = useRef(defaultProp)

    useEffect(() => {
      if (!isControlled && JSON.stringify(defaultProp) !== JSON.stringify(defaultValue)) {
        console.error(
          [
            `A component is changing the default ${state} state of an uncontrolled ${name} after being initialized. ` +
              `To suppress this warning opt to use a controlled ${name}.`,
          ].join('\n'),
        )
      }
    }, [JSON.stringify(defaultProp)])
  }

  const setValueIfUncontrolled: Dispatch<SetStateAction<T | undefined>> = useCallback(
    (newValue: SetStateAction<T | undefined>) => {
      if (!isControlled) {
        setValueState(newValue)
      }
    },
    [],
  )

  // TODO: provide overloads for the useControlled function to account for the case where either
  // controlled or default is not undefined.
  // In that case the return type should be [T, Dispatch<SetStateAction<T>>]
  // otherwise it should be [T | undefined, Dispatch<SetStateAction<T | undefined>>]
  return [value as T, setValueIfUncontrolled]
}
