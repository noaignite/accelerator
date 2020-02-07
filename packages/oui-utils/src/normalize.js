import mapRange from './mapRange'

export default function normalize(value, x, y) {
  return mapRange(value, x, y, 0, 1)
}
