import { isReactFragment } from '@noaignite/react-utils'
import type { ComponentProps, ReactElement } from 'react'
import { createElement, Fragment, StrictMode } from 'react'
import { describe, expect, expectTypeOf, test } from 'vitest'

describe('isReactFragment', () => {
  test('recognizes the Fragment token and fragment elements', () => {
    expect(isReactFragment(Fragment)).toBe(true)
    expect(isReactFragment(createElement(Fragment))).toBe(true)
  })

  test.each([
    [createElement(Fragment, { key: 'fragment' }, 'Hello'), true],
    [createElement('div'), false],
    [createElement(() => createElement('div')), false],
    [createElement(() => 1), false],
    [() => 1, false],
    [createElement(() => createElement(Fragment)), false],
    [StrictMode, false],
    [createElement(StrictMode), false],
    [[], false],
    [null, false],
    [{}, false],
    [{ type: Fragment, props: {} }, false],
    [undefined, false],
    [false, false],
    [0, false],
    ['fragment', false],
    [Symbol('react.fragment'), false],
  ])('isReactFragment(%s) is %s', (input, expected) => {
    expect(isReactFragment(input)).toBe(expected)
  })

  test.each([null, undefined, false, 0, 'props'])(
    'rejects a fragment element with non-object props: %s',
    (props) => {
      expect(isReactFragment({ ...createElement(Fragment), props })).toBe(false)
    },
  )

  test.each([Fragment, createElement(Fragment, null, 'Hello')])(
    'narrows unknown input to the token or a fragment element: %s',
    (input) => {
      const value: unknown = input

      if (!isReactFragment(value)) {
        throw new Error('Expected a Fragment token or element')
      }

      expectTypeOf(value).toEqualTypeOf<
        typeof Fragment | ReactElement<ComponentProps<typeof Fragment>, typeof Fragment>
      >()

      if (typeof value === 'object') {
        expectTypeOf(value).toEqualTypeOf<
          ReactElement<ComponentProps<typeof Fragment>, typeof Fragment>
        >()
        expectTypeOf(value.type).toEqualTypeOf<typeof Fragment>()
        expectTypeOf(value.props).toEqualTypeOf<ComponentProps<typeof Fragment>>()
      } else {
        expectTypeOf(value).toEqualTypeOf<typeof Fragment>()
      }

      expect(value).toBe(input)
    },
  )
})
