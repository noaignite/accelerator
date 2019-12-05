import map from './map'

test('0>1 = 0>2', () => {
  const t = i => map(i, 0, 1, 0, 2)
  expect(t(0)).toBe(0)
  expect(t(0.5)).toBe(1)
  expect(t(0.25)).toBe(0.5)
  expect(t(0.75)).toBe(1.5)
  expect(t(1)).toBe(2)
})

test('1>0 = 0>2', () => {
  const t = i => map(i, 1, 0, 0, 2)
  expect(t(0)).toBe(2)
  expect(t(0.5)).toBe(1)
  expect(t(0.25)).toBe(1.5)
  expect(t(0.75)).toBe(0.5)
  expect(t(1)).toBe(0)
})
