// Based on `getValueForCheckbox` in: https://github.com/formium/formik/blob/master/packages/formik/src/Formik.tsx
export default function getCheckboxValue(currentValue, checked, valueProp) {
  // If the current value was a boolean, return a boolean
  if (typeof currentValue === 'boolean') {
    return Boolean(checked)
  }

  // If the currentValue was not a boolean we want to return an array
  let currentArrayOfValues = []
  let isValueInArray = false
  let index = -1

  if (!Array.isArray(currentValue)) {
    // eslint-disable-next-line
    if (!valueProp || valueProp == 'true' || valueProp == 'false') {
      return Boolean(checked)
    }
  } else {
    // If the current value is already an array, use it
    currentArrayOfValues = currentValue
    index = currentValue.indexOf(valueProp)
    isValueInArray = index >= 0
  }

  // If the checkbox was checked and the value is not already present in the aray we want to add the new value to the array of values
  if (checked && valueProp && !isValueInArray) {
    return currentArrayOfValues.concat(valueProp)
  }

  // If the checkbox was unchecked and the value is not in the array, simply return the already existing array of values
  if (!isValueInArray) {
    return currentArrayOfValues
  }

  // If the checkbox was unchecked and the value is in the array, remove the value and return the array
  return currentArrayOfValues.slice(0, index).concat(currentArrayOfValues.slice(index + 1))
}
