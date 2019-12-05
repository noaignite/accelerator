function mapRange(value, inMin, inMid, inMax, outMin, outMid, outMax) {
  // const inMin = Math.min(inMinRaw, inMaxRaw)
  // const inMax = Math.max(inMinRaw, inMaxRaw)
  return value > inMid
    ? ((value - inMid) * (outMax - outMid)) / (inMax - inMid) + outMid
    : ((value - inMin) * (outMid - outMin)) / (inMid - inMin) + outMin
}

export default mapRange
