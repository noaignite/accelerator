import clampFunc from './clamp';

export default function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  clamp = false,
) {
  const val = clamp ? clampFunc(value, inMin, inMax) : value;
  return ((val - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
