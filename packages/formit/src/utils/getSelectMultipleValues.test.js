import getSelectMultipleValues from './getSelectMultipleValues'

describe('getSelectMultipleValues', () => {
  it('should return an array of values based on selected options', () => {
    const options = [
      { selected: true, value: 1 },
      { selected: false, value: 2 },
      { selected: true, value: 3 },
    ]
    const selectedOptions = getSelectMultipleValues(options)

    expect(selectedOptions.includes(1)).toEqual(true)
    expect(selectedOptions.includes(2)).toEqual(false)
    expect(selectedOptions.includes(3)).toEqual(true)
  })
})
