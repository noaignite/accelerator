/* eslint-disable no-undef */
/* eslint-disable no-restricted-syntax */
import interpolateDouble from './interpolateDouble'
import map from './map'
import range from './range'

const inRanges = ['0>0.5>1', '0>1>3', '0>0.5>4'].map(s => s.split('>').map(parseFloat))

const outRanges = ['0>2>6', '0>1>-1', '1>0>1', '0>1>0'].map(s => s.split('>').map(parseFloat))

const precision = 1000
const round = i => {
  const ret = Math.round(i * precision) / precision
  return Object.is(ret, -0) ? 0 : ret
}

const stepsPerRange = precision

const makeFunc = (minIn, midIn, maxIn, minOut, midOut, maxOut) => i =>
  interpolateDouble(i, minIn, midIn, maxIn, minOut, midOut, maxOut)

const makeTest = (inRange, outRange) => () => {
  const inStartSpan = inRange[1] - inRange[0]
  const inEndSpan = inRange[2] - inRange[1]
  const inStartRange = range(inRange[0], inRange[1], inStartSpan / stepsPerRange, true)
  const inEndRange = range(inRange[1], inRange[2], inEndSpan / stepsPerRange, true)
  const inValues = inStartRange.concat(inEndRange)

  const outStartRange = inStartRange.map(i =>
    map(i, inRange[0], inRange[1], outRange[0], outRange[1]),
  )
  const outEndRange = inEndRange.map(i => map(i, inRange[1], inRange[2], outRange[1], outRange[2]))
  const outValues = outStartRange.concat(outEndRange).map(round)

  const results = inValues
    .map(makeFunc(inRange[0], inRange[1], inRange[2], outRange[0], outRange[1], outRange[2]))
    .map(round)
  expect(results).toEqual(outValues)
}

for (const inRange of inRanges) {
  for (const outRange of outRanges) {
    for (const reverseOut of [true, false]) {
      for (const reverseIn of [false, true]) {
        const input = reverseIn ? [].concat(inRange).reverse() : [].concat(inRange)
        const out = reverseOut ? [].concat(outRange).reverse() : [].concat(outRange)
        test(`${inRange.join('>')} = ${outRange.join('>')}`, makeTest(input, out))
      }
    }
  }
}

test('0>1>2 = 0>2>6', () => {
  const t = i => interpolateDouble(i, 0, 1, 2, 0, 2, 6)
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
  const t = i => interpolateDouble(i, 0, 0.5, 1, 0, 1, -1)
  expect(t(0)).toBe(0)
  expect(t(0.25)).toBe(0.5)
  expect(t(0.5)).toBe(1)
  expect(t(0.75)).toBe(0)
  expect(t(1)).toBe(-1)
})

test('0>0.5>1 = 0>1>0', () => {
  const t = i => interpolateDouble(i, 0, 0.5, 1, 0, 1, 0)
  expect(t(0)).toBe(0)
  expect(t(0.25)).toBe(0.5)
  expect(t(0.5)).toBe(1)
  expect(t(0.75)).toBe(0.5)
  expect(t(1)).toBe(0)
})

test('0>0.25>1 = 1>0>1', () => {
  const t = i => interpolateDouble(i, 0, 0.25, 1, 1, 0, 1)
  expect(t(0)).toBe(1)
  expect(t(0.125)).toBe(0.5)
  expect(t(0.25)).toBe(0)
  expect(t(0.625)).toBe(0.5)
  expect(t(1)).toBe(1)
})

test('1>0.5>0 = 1>0>1', () => {
  const t = i => interpolateDouble(i, 1, 0.5, 0, 1, 0, 1)
  expect(t(1)).toBe(1)
  expect(t(0.75)).toBe(0.5)
  expect(t(0.5)).toBe(0)
  expect(t(0.25)).toBe(0.5)
  expect(t(0)).toBe(1)
})
