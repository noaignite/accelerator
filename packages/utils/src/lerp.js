export default function lerp(start, end, amount) {
  return (1 - amount) * start + amount * end
}
