import map from './map'

function normalize(value, x, y) {
  return map(value, x, y, 0, 1)
}

export default normalize
