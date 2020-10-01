import mapRange from './mapRange'

function interpolateDouble(value, inMin, inMid, inMax, outMin, outMid, outMax) {
  if (inMin < inMax) {
    return value > inMid
      ? mapRange(value, inMid, inMax, outMid, outMax)
      : mapRange(value, inMin, inMid, outMin, outMid)
  }
  return value < inMid
    ? mapRange(value, inMid, inMax, outMid, outMax)
    : mapRange(value, inMin, inMid, outMin, outMid)
}

export default interpolateDouble
