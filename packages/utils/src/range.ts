function range(start: number, stop: number, step = 1, inclusive = true) {
  return Array(Math.ceil((stop - start) / step) + (inclusive ? 1 : 0))
    .fill(start)
    .map((x: number, y: number) => x + y * step)
}

export default range
