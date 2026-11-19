import { isReactElement } from '@noaignite/react-utils'
import { assert } from '@noaignite/utils'
import type { ReactElement } from 'react'
import { createElement, Fragment, isValidElement } from 'react'
import { describe, expect, expectTypeOf, test } from 'vitest'

describe('isReactElement', () => {
  const Component = () => createElement('div')

  test.each([
    [createElement('div'), true],
    [createElement(Component), true],
    [createElement(() => 1), true],
    [createElement(Fragment), true],
    [Fragment, false],
    [[], false],
    [null, false],
    [{}, false],
    [undefined, false],
  ])('isReactElement(%s) is %s', (input, expected) => {
    expect(isReactElement(input)).toEqual(expected)
  })

  test.each([null, undefined, false, 0, 'props'])(
    'rejects an element with non-object props: %s',
    (props) => {
      const value = { ...createElement('div'), props }

      expect(isValidElement(value)).toBe(true)
      expect(isReactElement(value)).toBe(false)
    },
  )

  test('narrows an unknown value to a React element with object props', () => {
    const value: unknown = createElement('div', { id: 'example' })

    assert(isReactElement(value), 'Expected a React element')

    expectTypeOf(value).toEqualTypeOf<ReactElement<Record<string, unknown>>>()
    expectTypeOf(value.props).toEqualTypeOf<Record<string, unknown>>()
    expect(value.props.id).toBe('example')
  })
})
