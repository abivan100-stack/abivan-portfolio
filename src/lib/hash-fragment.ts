export function readHashFragment(hash?: string) {
  const fragment = hash ?? (typeof window === 'undefined' ? '' : window.location.hash)
  const encodedFragment = fragment.startsWith('#') ? fragment.slice(1) : fragment
  if (!encodedFragment) return ''

  try {
    return decodeURIComponent(encodedFragment)
  } catch {
    return ''
  }
}
