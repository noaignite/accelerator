import IntersectionObserverAdmin from 'intersection-observer-admin'

let intersectionObserverAdmin: IntersectionObserverAdmin | null = null

export default function getObserverInstance() {
  if (!intersectionObserverAdmin) {
    intersectionObserverAdmin = new IntersectionObserverAdmin()
  }

  return intersectionObserverAdmin
}
