export * from '@testing-library/react'

export function render() {
  throw new Error("Don't use `render` directly. Instead use the return value from `createRender`")
}

export { default as createRender } from './createRender'
export { default as describeConformance } from './describeConformance'
