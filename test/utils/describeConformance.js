// Based on: https://github.com/mui-org/material-ui/blob/next/test/utils/describeConformance.js

import * as React from 'react'
import ReactTestRenderer from 'react-test-renderer'
import { screen } from '@testing-library/react'

function randomStringValue() {
  return `s${Math.random().toString(36).slice(2)}`
}

/**
 * OUI components have a `className` prop. The `className` is applied to
 * the root component.
 * @param {React.ReactElement} element
 * @param {() => ConformanceOptions} getOptions
 */
function testClassName(element, getOptions) {
  it('applies the className to the root component', () => {
    const { render } = getOptions()
    const className = randomStringValue()

    render(React.cloneElement(element, { 'data-testid': 'root', className }))

    expect(screen.getByTestId('root')).toHaveClass(className)
  })
}

/**
 * OUI components have a `component` prop that allows rendering a different
 * Component from @inheritComponent
 * @param {React.ReactElement} element
 * @param {() => ConformanceOptions} getOptions
 */
function testComponentProp(element, getOptions) {
  describe('prop: component', () => {
    it('renders correct initial root component', () => {
      const { inheritComponent, render } = getOptions()

      render(React.cloneElement(element, { 'data-testid': 'root' }))

      expect(screen.getByTestId('root').tagName.toLowerCase()).toEqual(inheritComponent)
    })

    it('renders another root component with the `component` prop', () => {
      const { render, testComponentPropWith: component = 'em' } = getOptions()

      render(React.cloneElement(element, { 'data-testid': 'root', component }))

      expect(screen.getByTestId('root').tagName.toLowerCase()).toEqual(component)
    })
  })
}

/**
 * OUI components can spread additional props to a documented component.
 * It's set via @inheritComponent in the source.
 * @param {React.ReactElement} element
 * @param {() => ConformanceOptions} getOptions
 */
function testPropsSpread(element, getOptions) {
  it(`spreads props to the root component`, () => {
    const { render } = getOptions()

    render(React.cloneElement(element, { 'data-testid': 'root' }))

    expect(screen.getByTestId('root')).toBeInTheDocument()
  })
}

/**
 * Tests that the `ref` of a component will return the correct instance
 *
 * This is determined by a given constructor i.e. a React.Component or HTMLElement for
 * components that forward their ref and attach it to a host component.
 * @param {React.ReactElement} element
 * @param {() => ConformanceOptions} getOptions
 */
function describeRef(element, getOptions) {
  describe('ref', () => {
    it(`attaches the ref`, () => {
      const { refInstanceof, render } = getOptions()

      const ref = React.createRef()
      render(React.cloneElement(element, { 'data-testid': 'root', ref }))

      expect(screen.getByTestId('root')).toEqual(ref.current)
      expect(ref.current).toBeInstanceOf(refInstanceof)
    })
  })
}

/**
 * Tests that the root component has the root class
 * @param {React.ReactElement} element
 * @param {() => ConformanceOptions} getOptions
 */
function testRootClass(element, getOptions) {
  it('applies the root class to the root component if it has this class', () => {
    const { classes, render } = getOptions()
    if (classes.root == null) {
      return
    }

    const className = randomStringValue()
    render(React.cloneElement(element, { 'data-testid': 'root', className }))

    // we established that the root component renders the outermost host previously. We immediately
    // jump to the host component because some components pass the `root` class
    // to the `classes` prop of the root component.
    // https://github.com/mui-org/material-ui/blob/f9896bcd129a1209153106296b3d2487547ba205/packages/material-ui/src/OutlinedInput/OutlinedInput.js#L101
    expect(screen.getByTestId('root')).toHaveClass(classes.root)
    expect(screen.getByTestId('root')).toHaveClass(className)
  })
}

/**
 * Tests that the component can be rendered with react-test-renderer.
 * This is important for snapshot testing with Jest (even if we don't encourage it).
 * @param {React.ReactElement} element
 */
function testReactTestRenderer(element) {
  it('should render without errors in ReactTestRenderer', () => {
    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(element, {
        createNodeMock: (node) => {
          return document.createElement(node.type)
        },
      })
    })
  })
}

const fullSuite = {
  componentProp: testComponentProp,
  mergeClassName: testClassName,
  propsSpread: testPropsSpread,
  refForwarding: describeRef,
  rootClass: testRootClass,
  reactTestRenderer: testReactTestRenderer,
}

/**
 * @typedef {Object} ConformanceOptions
 * @property {Record<string, string>} classes - `classes` of the component provided by `@material-ui/styles`
 * @property {import('react').ElementType} inheritComponent - The element type that receives spread props.
 * @property {(node: React.ReactNode) => void} render - Should be a return value from createRender
 * @property {Array<keyof typeof fullSuite>} [only] - If specified only run the tests listed
 * @property {any} refInstanceof - `ref` will be an instanceof this constructor.
 * @property {Array<keyof typeof fullSuite>} [skip] - Skip the specified tests
 * @property {string} [testComponentPropWith] - The host component that should be rendered instead.
 */

/**
 * Tests various aspects of a component that should be equal across OUI
 * components.
 * @param {React.ReactElement} minimalElement - the component with it's minimal required props
 * @param {() => ConformanceOptions} getOptions
 */
export default function describeConformance(minimalElement, getOptions) {
  const { after: runAfterHook = () => {}, only = Object.keys(fullSuite), skip = [] } = getOptions()
  describe('OUI component API', () => {
    afterAll(runAfterHook)

    Object.keys(fullSuite)
      .filter((testKey) => only.indexOf(testKey) !== -1 && skip.indexOf(testKey) === -1)
      .forEach((testKey) => {
        const test = fullSuite[testKey]
        test(minimalElement, getOptions)
      })
  })
}
