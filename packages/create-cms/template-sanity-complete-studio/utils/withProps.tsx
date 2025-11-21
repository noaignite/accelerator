import * as React from 'react'

function withProps<T extends object>(ExtendedComponent: React.ComponentType<T>, props: Partial<T>) {
  return function componentWithProps(sanityProps: T) {
    return <ExtendedComponent {...props} {...sanityProps} />
  }
}

export default withProps
