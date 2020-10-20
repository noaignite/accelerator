// Based on `getSelectedValues` in: https://github.com/formium/formik/blob/master/packages/formik/src/Formik.tsx
export default function getSelectMultipleValues(options) {
  return Array.from(options)
    .filter((el) => el.selected)
    .map((el) => el.value)
}
