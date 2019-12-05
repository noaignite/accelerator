import range from './range'

test('0>10', () => {
  const a = range(0, 10)
  expect(a).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
})

test('0, 1, 0.25, true', () => {
  const a = range(0, 1, 0.25, true)
  expect(a).toEqual([0, 0.25, 0.5, 0.75, 1])
})

test('0, 1, 0.25', () => {
  const a = range(0, 1, 0.25)
  expect(a).toEqual([0, 0.25, 0.5, 0.75])
})
