import * as React from 'react'

export default function useLatest(value) {
  const storedValue = React.useRef(value)
  React.useEffect(() => {
    storedValue.current = value
  })
  return storedValue
}
