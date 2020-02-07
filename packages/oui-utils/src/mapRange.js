import clamp from './clamp'

export default function mapRange(value, inMin, inMax, outMin, outMax, useClamp) {
  const val = useClamp ? clamp(value, inMin, inMax) : value
  return ((val - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}
