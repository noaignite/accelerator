import clampFunc from './clamp'

export default function mapRange(value, inMin, inMax, outMin, outMax, clamp = false) {
  const val = clamp ? clampFunc(value, inMin, inMax) : value
  return ((val - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}
