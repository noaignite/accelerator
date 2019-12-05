import mapRange from './mapRange'

test('0>1>2 = 0>2>6', () => {
  const t = i => mapRange(i, 0, 1, 2, 0, 2, 6)
  expect(t(0)).toBe(0)
  expect(t(0.25)).toBe(0.5)
  expect(t(0.5)).toBe(1)
  expect(t(0.75)).toBe(1.5)
  expect(t(1)).toBe(2)
  expect(t(1.25)).toBe(3)
  expect(t(1.5)).toBe(4)
  expect(t(1.75)).toBe(5)
  expect(t(2)).toBe(6)
})

test('0>0.5>1 = 0>1>-1', () => {
  const t = i => mapRange(i, 0, 0.5, 1, 0, 1, -1)
  expect(t(0)).toBe(0)
  expect(t(0.25)).toBe(0.5)
  expect(t(0.5)).toBe(1)
  expect(t(0.75)).toBe(0)
  expect(t(1)).toBe(-1)
})

test('0>0.5>1 = 0>1>0', () => {
  const t = i => mapRange(i, 0, 0.5, 1, 0, 1, 0)
  expect(t(0)).toBe(0)
  expect(t(0.25)).toBe(0.5)
  expect(t(0.5)).toBe(1)
  expect(t(0.75)).toBe(0.5)
  expect(t(1)).toBe(0)
})
