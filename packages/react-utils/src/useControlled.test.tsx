import { act, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useControlled } from './useControlled'

type SetValue<T> = (newValue: T) => void

type TextComponentProps<T = unknown> = {
  value?: T | undefined
  defaultValue?: T | undefined
  children: (bag: { value: T | undefined; setValue: SetValue<T> }) => ReactNode
}

function TestComponent<T>(props: TextComponentProps<T>) {
  const { value: valueProp, defaultValue, children } = props
  const [value, setValue] = useControlled({
    controlled: valueProp,
    default: defaultValue,
    name: 'TestComponent',
  })
  return children({ value, setValue })
}

describe('useControlled', () => {
  it('works correctly when is not controlled', () => {
    let valueState: number | undefined
    let setValueState: SetValue<NonNullable<typeof valueState>>
    render(
      <TestComponent defaultValue={1}>
        {({ value, setValue }) => {
          valueState = value
          setValueState = setValue
          return null
        }}
      </TestComponent>,
    )
    expect(valueState).toBe(1)

    act(() => {
      setValueState(2)
    })

    expect(valueState).toBe(2)
  })

  it('works correctly when is controlled', () => {
    let valueState
    render(
      <TestComponent value={1}>
        {({ value }) => {
          valueState = value
          return null
        }}
      </TestComponent>,
    )
    expect(valueState).toBe(1)
  })

  it('warns when switching from uncontrolled to controlled', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { rerender } = render(<TestComponent>{() => null}</TestComponent>)

    expect(consoleSpy).not.toHaveBeenCalled()
    rerender(<TestComponent value="foobar">{() => null}</TestComponent>)
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'A component is changing the uncontrolled value state of TestComponent to be controlled.',
      ),
    )

    consoleSpy.mockRestore()
  })

  it('warns when switching from controlled to uncontrolled', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { rerender } = render(<TestComponent value="foobar">{() => null}</TestComponent>)

    expect(consoleSpy).not.toHaveBeenCalled()
    rerender(<TestComponent value={undefined}>{() => null}</TestComponent>)
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'A component is changing the controlled value state of TestComponent to be uncontrolled.',
      ),
    )

    consoleSpy.mockRestore()
  })

  it('warns when changing the defaultValue prop after initial rendering', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { rerender } = render(<TestComponent>{() => null}</TestComponent>)

    expect(consoleSpy).not.toHaveBeenCalled()
    rerender(<TestComponent defaultValue={1}>{() => null}</TestComponent>)
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'A component is changing the default value state of an uncontrolled TestComponent after being initialized.',
      ),
    )

    consoleSpy.mockRestore()
  })

  it('should not raise a warning if changing the defaultValue when controlled', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { rerender } = render(
      <TestComponent defaultValue={0} value={1}>
        {() => null}
      </TestComponent>,
    )

    expect(consoleSpy).not.toHaveBeenCalled()
    rerender(
      <TestComponent defaultValue={1} value={1}>
        {() => null}
      </TestComponent>,
    )
    expect(consoleSpy).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('should not raise a warning if setting NaN as the defaultValue when uncontrolled', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<TestComponent defaultValue={NaN}>{() => null}</TestComponent>)
    expect(consoleSpy).not.toHaveBeenCalled()
  })
})
