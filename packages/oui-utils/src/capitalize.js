// It should to be noted that this function isn't equivalent to `text-transform: capitalize`.
//
// A strict capitalization should uppercase the first letter of each word a the sentence.
// We only handle the first word.
function capitalize(string) {
  if (process.env.NODE_ENV !== 'production' && typeof string !== 'string') {
    throw new Error('Oakwood-UI: capitalize(string) expects a string argument.')
  }

  return string.charAt(0).toUpperCase() + string.slice(1)
}

export default capitalize
