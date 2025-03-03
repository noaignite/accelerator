import type { HTMLElementType } from 'react'
import { createElement } from 'react'
import { describe, expect, it } from 'vitest'
import { createPolymorph } from '.'

describe('createPolymorph', () => {
  it('is a function', () => {
    expect(createPolymorph).toBeTypeOf('function')
  })

  const testFunction = (props: { as?: HTMLElementType }) => {
    return createElement(props.as ?? 'div')
  }

  it('returns passed reference-equal function', () => {
    expect(createPolymorph<object, HTMLElementType>(testFunction)).toEqual(testFunction)
  })
})
