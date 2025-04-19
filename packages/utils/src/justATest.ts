type Options = {
  condition: 'a' | 'b' | 'c'
}

export function justATest(options: Options) {
  const { condition } = options

  if (condition === 'a') {
    return 'foo'
  }
  if (condition === 'b') {
    return 3
  }
  return null
}
