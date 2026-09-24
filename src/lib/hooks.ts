import { useEffect } from 'react'
import { readHashFragment } from './hash-fragment'

// Wires in [data-power-up] sections (the timeline and the projects bus) are drawn in the first time each
// scrolls into view. They are only hidden once JS has armed them, so without IntersectionObserver or
// with reduced motion they simply show.
export function usePowerUp() {
  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>('[data-power-up]')]
    if (!sections.length || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    sections.forEach((section) => section.classList.add('is-armed'))
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-live')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.12 })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])
}

// Section targets flash their net label and project sheets flash themselves; #top wraps the whole page,
// so it flashes nothing.
function flashTarget(id: string) {
  const target = document.getElementById(id)
  const flashed = target?.tagName === 'SECTION'
    ? target.querySelector<HTMLElement>('.net-label')
    : target?.classList.contains('sub-sheet') ? target : null
  if (!flashed) return
  flashed.classList.remove('is-flashing')
  void flashed.offsetWidth // restart the animation if the same link is clicked twice
  flashed.classList.add('is-flashing')
}

// Following an in-page link highlights the destination, the way KiCad highlights a net you click.
// Arriving from another page with a #hash does the same, after scrolling there: the page renders after
// the browser's own jump to the hash, so that jump would otherwise miss.
export function useNetFlash() {
  useEffect(() => {
    const arrivedAt = readHashFragment()
    if (arrivedAt) {
      document.getElementById(arrivedAt)?.scrollIntoView({ behavior: 'instant' })
      flashTarget(arrivedAt)
    }

    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null
      const id = link ? readHashFragment(link.getAttribute('href') ?? '') : ''
      if (id) flashTarget(id)
    }
    const onAnimationEnd = (event: AnimationEvent) => {
      if (!['net-flash', 'sheet-flash'].includes(event.animationName) || !(event.target instanceof Element)) return
      event.target.closest('.is-flashing')?.classList.remove('is-flashing')
    }
    document.addEventListener('click', onClick)
    document.addEventListener('animationend', onAnimationEnd)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('animationend', onAnimationEnd)
    }
  }, [])
}
