import * as React from 'react'

export default function useLatest<T>(value: T) {
  const storedValue = React.useRef(value)
  React.useEffect(() => {
    storedValue.current = value
  })
  return storedValue
}
