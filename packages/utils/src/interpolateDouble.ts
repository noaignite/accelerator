import mapRange from './mapRange'
// import keyframer from './keyframer'

// export default function kek(value, inMin, inMid, inMax, outMin, outMid, outMax) {
//   return keyframer([
//     [inMin, outMin],
//     [inMid, outMid],
//     [inMax, outMax],
//   ])(value)
// }

function interpolateDouble(
  value: number,
  inMin: number,
  inMid: number,
  inMax: number,
  outMin: number,
  outMid: number,
  outMax: number,
  clamp = false,
) {
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