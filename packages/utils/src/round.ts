/**
 * The `round` function rounds a number to a given precision. Positive
 * precision rounds to decimal places, negative precision rounds to powers of
 * ten, and the default precision rounds to the nearest integer.
 *
 * @param number - The number to round.
 * @param precision - The precision to round to. Defaults to `0`.
 * @returns The rounded number.
 *
 * @example
 * ```ts
 * round(4.006) // 4
 * round(4.006, 2) // 4.01
 * round(4060, -2) // 4100
 * ```
 */
export function round(number: number, precision = 0) {
  if (precision === 0) {
    return Math.round(number)
  }

  const [coefficient, exponent = 0] = `${number}e`.split('e')
  const shifted = Math.round(Number(`${coefficient}e${Number(exponent) + precision}`))
  const [shiftedCoefficient, shiftedExponent = 0] = `${shifted}e`.split('e')

  return Number(`${shiftedCoefficient}e${Number(shiftedExponent) - precision}`)
}
