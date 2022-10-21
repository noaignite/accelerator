import * as React from 'react'

export default function useLatest<T>(current: T) {
  const storedValue = React.useRef(current)
  React.useEffect(() => {
    storedValue.current = current
  })
  return storedValue
}
