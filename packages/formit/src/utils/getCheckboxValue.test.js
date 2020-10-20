import getCheckboxValue from './getCheckboxValue'

describe('getCheckboxValue', () => {
  it('should return a boolean', () => {
    expect(getCheckboxValue(false, false)).toEqual(false)
    expect(getCheckboxValue(false, true)).toEqual(true)
  })

  it('should return a boolean even if initial value was not a boolean', () => {
    expect(getCheckboxValue('', false)).toEqual(false)
    expect(getCheckboxValue('', true)).toEqual(true)
    expect(getCheckboxValue('', true, 'false')).toEqual(true)
    expect(getCheckboxValue('', true, 'true')).toEqual(true)
  })

  it('should return an array of values if initial value was an array', () => {
    let values = []

    values = getCheckboxValue(values, true, 'apple')
    values = getCheckboxValue(values, false, 'banana')
    expect(values.includes('apple')).toEqual(true)
    expect(values.includes('banana')).toEqual(false)

    values = getCheckboxValue(values, true, 'banana')
    expect(values.includes('apple')).toEqual(true)
    expect(values.includes('banana')).toEqual(true)

    values = getCheckboxValue(values, false, 'apple')
    expect(values.includes('apple')).toEqual(false)
    expect(values.includes('banana')).toEqual(true)
  })
})
