import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { getReactElementRef } from './getReactElementRef'

describe('getReactElementRef', () => {
  it('should return undefined when not used correctly', () => {
    // @ts-expect-error -- Test incorrect interface.
    expect(getReactElementRef(false)).to.equal(null)
    // @ts-expect-error -- Test incorrect interface.
    expect(getReactElementRef()).to.equal(null)
    // @ts-expect-error -- Test incorrect interface.
    expect(getReactElementRef(1)).to.equal(null)

    const children = [<div key="1" />, <div key="2" />]
    // @ts-expect-error -- Test incorrect interface.
    expect(getReactElementRef(children)).to.equal(null)
  })

  it('should return the ref of a React element', () => {
    const ref = createRef<HTMLDivElement>()
    const element = <div ref={ref} />
    expect(getReactElementRef(element)).to.equal(ref)
  })

  it('should return null for a fragment', () => {
    const element = (
      <>
        <p>Hello</p>
        <p>Hello</p>
      </>
    )
    expect(getReactElementRef(element)).to.equal(null)
  })

  it('should return null for element with no ref', () => {
    const element = <div />
    expect(getReactElementRef(element)).to.equal(null)
  })
})
