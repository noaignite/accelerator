/**
 * Generates a fluid value based on the given parameters.
 *
 * @internal
 * @param minValue - The minimum value for the property (at the smallest viewport).
 * @param maxValue - The maximum value for the property (at the largest viewport).
 * @param minViewport - The minimum viewport width where the fluid value starts.
 * @param maxViewport - The maximum viewport width where the fluid value ends.
 * @param unit - The unit of the values (default is 'px').
 * @param clampMin - Whether to clamp the value at the minimum.
 * @param clampMax - Whether to clamp the value at the maximum.
 * @returns A string containing the CSS `calc` or `clamp` formula for the fluid value.
 */
export function fluidValue(
  minValue: number,
  maxValue: number,
  minViewport: number,
  maxViewport: number,
  unit = 'px',
  clampMin = false,
  clampMax = false,
) {
  // Set up the fluid formula.
  const deltaValue = maxValue - minValue
  const deltaViewport = maxViewport - minViewport
  const value = `calc(${minValue}${unit} + ${deltaValue} * ((100vw - ${minViewport}${unit}) / ${deltaViewport}))`

  // Clamp fontSize values if enabled.
  if (clampMin && clampMax) {
    return `clamp(${minValue}${unit}, ${value}, ${maxValue}${unit})`
  }
  if (clampMin) {
    return `max(${minValue}${unit}, ${value})`
  }
  if (clampMax) {
    return `min(${maxValue}${unit}, ${value})`
  }
  return value
}
