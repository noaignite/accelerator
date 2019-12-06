import map from './map'

function interpolateDouble(value, inMin, inMid, inMax, outMin, outMid, outMax) {
  if (inMin < inMax) {
    return value > inMid
      ? map(value, inMid, inMax, outMid, outMax)
      : map(value, inMin, inMid, outMin, outMid)
  }
  return value < inMid
    ? map(value, inMid, inMax, outMid, outMax)
    : map(value, inMin, inMid, outMin, outMid)
}

export default interpolateDouble
