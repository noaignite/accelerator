function mapRange(value, inMin, inMid, inMax, outMin, outMid, outMax) {
  return value > inMid
    ? ((value - inMid) * (outMax - outMid)) / (inMax - inMid) + outMid
    : ((value - inMin) * (outMid - outMin)) / (inMid - inMin) + outMin
}

export default mapRange
