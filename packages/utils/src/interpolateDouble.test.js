import interpolateDouble from './interpolateDouble'
import mapRange from './mapRange'
import range from './range'

const inRanges = ['0>0.5>1', '0>1>3', '0>0.5>4'].map((s) => s.split('>').map(parseFloat))

const outRanges = ['0>2>6', '0>1>-1', '1>0>1', '0>1>0'].map((s) => s.split('>').map(parseFloat))

const precision = 1000
const round = (i) => {
  const ret = Math.round(i * precision) / precision
  return Object.is(ret, -0) ? 0 : ret
}

const stepsPerRange = precision

const makeFunc = (minIn, midIn, maxIn, minOut, midOut, maxOut) => (i) =>
  interpolateDouble(i, minIn, midIn, maxIn, minOut, midOut, maxOut)

describe('interpolateDouble', () => {
  inRanges.forEach((inRange) => {
    outRanges.forEach((outRange) => {
      ;[true, false].forEach((reverseOut) => {
        ;[false, true].forEach((reverseIn) => {
          const input = reverseIn ? [].concat(inRange).reverse() : [].concat(inRange)
          const output = reverseOut ? [].concat(outRange).reverse() : [].concat(outRange)

          it(`interpolates ${inRange.join('>')} into ${outRange.join('>')}`, () => {
            const inStartSpan = input[1] - input[0]
            const inEndSpan = input[2] - input[1]
            const inStartRange = range(input[0], input[1], inStartSpan / stepsPerRange, true)
            const inEndRange = range(input[1], input[2], inEndSpan / stepsPerRange, true)
            const inValues = inStartRange.concat(inEndRange)

            const outStartRange = inStartRange.map((i) =>
              mapRange(i, input[0], input[1], output[0], output[1]),
            )
            const outEndRange = inEndRange.map((i) =>
              mapRange(i, input[1], input[2], output[1], output[2]),
            )
            const outValues = outStartRange.concat(outEndRange).map(round)

            const results = inValues
              .map(makeFunc(input[0], input[1], input[2], output[0], output[1], output[2]))
              .map(round)

            expect(results).toEqual(outValues)
          })
        })
      })
    })
  })

  it('interpolates 0>1>2 into 0>2>6', () => {
    const t = (i) => interpolateDouble(i, 0, 1, 2, 0, 2, 6)
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

  it('interpolates 0>0.5>1 into 0>1>-1', () => {
    const t = (i) => interpolateDouble(i, 0, 0.5, 1, 0, 1, -1)
    expect(t(0)).toBe(0)
    expect(t(0.25)).toBe(0.5)
    expect(t(0.5)).toBe(1)
    expect(t(0.75)).toBe(0)
    expect(t(1)).toBe(-1)
  })

  it('interpolates 0>0.5>1 into 0>1>0', () => {
    const t = (i) => interpolateDouble(i, 0, 0.5, 1, 0, 1, 0)
    expect(t(0)).toBe(0)
    expect(t(0.25)).toBe(0.5)
    expect(t(0.5)).toBe(1)
    expect(t(0.75)).toBe(0.5)
    expect(t(1)).toBe(0)
  })

  it('interpolates 0>0.25>1 into 1>0>1', () => {
    const t = (i) => interpolateDouble(i, 0, 0.25, 1, 1, 0, 1)
    expect(t(0)).toBe(1)
    expect(t(0.125)).toBe(0.5)
    expect(t(0.25)).toBe(0)
    expect(t(0.625)).toBe(0.5)
    expect(t(1)).toBe(1)
  })

  it('interpolates 1>0.5>0 into 1>0>1', () => {
    const t = (i) => interpolateDouble(i, 1, 0.5, 0, 1, 0, 1)
    expect(t(1)).toBe(1)
    expect(t(0.75)).toBe(0.5)
    expect(t(0.5)).toBe(0)
    expect(t(0.25)).toBe(0.5)
    expect(t(0)).toBe(1)
  })
})
