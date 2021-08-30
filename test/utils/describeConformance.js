// Based on: https://github.com/mui-org/material-ui/blob/next/test/utils/describeConformance.js

import * as React from 'react'
import ReactTestRenderer from 'react-test-renderer'
import { screen } from '@testing-library/react'
import { createTheme } from '@material-ui/core/styles'

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

function throwMissingPropError(field) {
  throw new Error(`missing "${field}" in options

  > describeConformance(element, () => options)
`)
}

/**
 * OUI theme has a components section that allows specifying default props.
 * Components from @inheritComponent
 * @param {React.ReactElement} element
 * @param {() => ConformanceOptions} getOptions
 */
function testThemeDefaultProps(element, getOptions) {
  describe('theme default components:', () => {
    it("respect theme's defaultProps", () => {
      const testProp = 'data-oui-test'
      const { ouiName, render } = getOptions()

      if (!ouiName) {
        throwMissingPropError('ouiName')
      }

      const theme = createTheme({
        components: {
          [ouiName]: {
            defaultProps: {
              [testProp]: 'testProp',
            },
          },
        },
      })

      render(React.cloneElement(element, { 'data-testid': 'root' }), { wrapperProps: { theme } })

      expect(screen.getByTestId('root')).toHaveAttribute(testProp, 'testProp')
    })
  })
}

/**
 * OUI theme has a components section that allows specifying style overrides.
 * Components from @inheritComponent
 * @param {React.ReactElement} element
 * @param {() => ConformanceOptions} getOptions
 */
function testThemeStyleOverrides(element, getOptions) {
  describe('theme style overrides:', () => {
    it("respect theme's styleOverrides slots", () => {
      const {
        ouiName,
        testDeepOverrides,
        testRootOverrides = { slotName: 'root' },
        render,
      } = getOptions()

      const theme = createTheme({
        components: {
          [ouiName]: {
            styleOverrides: {
              [testRootOverrides.slotName]: {
                mixBlendMode: 'darken',
                ...(testDeepOverrides && {
                  [`& .${testDeepOverrides.slotClassName}`]: {
                    fontVariantCaps: 'all-petite-caps',
                  },
                }),
              },
              ...(testDeepOverrides && {
                [testDeepOverrides.slotName]: {
                  mixBlendMode: 'darken',
                },
              }),
            },
          },
        },
      })

      render(React.cloneElement(element, { 'data-testid': 'root' }), { wrapperProps: { theme } })

      const rootElement = screen.getByTestId('root')
      const rootComputedStyles = getComputedStyle(rootElement)

      expect(rootComputedStyles.getPropertyValue('mix-blend-mode')).toEqual('darken')

      if (testDeepOverrides) {
        // eslint-disable-next-line testing-library/no-node-access
        const deepElement = rootElement.querySelector(`.${testDeepOverrides.slotClassName}`)
        const deepComputedStyles = getComputedStyle(deepElement)

        expect(deepComputedStyles.getPropertyValue('font-variant-caps')).toEqual('all-petite-caps')
        expect(deepComputedStyles.getPropertyValue('mix-blend-mode')).toEqual('darken')
      }
    })
  })
}

const fullSuite = {
  componentProp: testComponentProp,
  mergeClassName: testClassName,
  propsSpread: testPropsSpread,
  refForwarding: describeRef,
  reactTestRenderer: testReactTestRenderer,
  themeDefaultProps: testThemeDefaultProps,
  themeStyleOverrides: testThemeStyleOverrides,
}

/**
 * Tests various aspects of a component that should be equal across OUI
 * components.
 * @param {React.ReactElement} minimalElement - the component with it's minimal required props
 * @param {() => ConformanceOptions} getOptions
 */
export default function describeConformance(minimalElement, getOptions) {
  describe('OUI component API', () => {
    const {
      after: runAfterHook = () => {},
      only = Object.keys(fullSuite),
      skip = [],
    } = getOptions()

    const filteredTests = Object.keys(fullSuite).filter(
      (testKey) => only.indexOf(testKey) !== -1 && skip.indexOf(testKey) === -1,
    )

    afterAll(runAfterHook)

    filteredTests.forEach((testKey) => {
      const test = fullSuite[testKey]
      test(minimalElement, getOptions)
    })
  })
}
