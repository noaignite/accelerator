import mapRange from './mapRange'

function normalize(value, x, y) {
  return mapRange(value, x, y, 0, 1)
}

export default normalize
