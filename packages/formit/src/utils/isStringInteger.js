export default function isInteger(value) {
  return String(Math.floor(Number(value))) === value
}
