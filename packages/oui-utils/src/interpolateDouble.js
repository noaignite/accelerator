import mapRange from './mapRange'

function interpolateDouble(value, inMin, inMid, inMax, outMin, outMid, outMax, clamp = false) {
  if (inMin < inMax) {
    return value > inMid
      ? mapRange(value, inMid, inMax, outMid, outMax, clamp)
      : mapRange(value, inMin, inMid, outMin, outMid, clamp)
  }
  return value < inMid
    ? mapRange(value, inMid, inMax, outMid, outMax, clamp)
    : mapRange(value, inMin, inMid, outMin, outMid, clamp)
}

export default interpolateDouble
