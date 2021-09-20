import * as React from 'react'

/**
 * Extracts the available classes for the `classes` prop of the given component
 * @param {React.ReactElement} element - An element created from a Material-UI component that implements the `classes` prop.
 * @param {(node: React.ReactNode) => void} render - Should be a return value from createRender
 * @returns {Record<string, string>}
 */
export default function getClasses(element, render) {
  const { useStyles } = element.type

  let classes
  function Listener() {
    classes = useStyles(element.props)
    return null
  }
  render(<Listener />)

  return classes
}
