import IntersectionObserverAdmin from 'intersection-observer-admin'

let intersectionObserverAdmin = null

export default function getObserverInstance() {
  if (!intersectionObserverAdmin) {
    intersectionObserverAdmin = new IntersectionObserverAdmin()
  }

  return intersectionObserverAdmin
}
