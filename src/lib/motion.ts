import type { Variants } from 'framer-motion'

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.24, ease: 'easeOut' } },
}

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055 } },
}

export const sidebarLabels: Variants = {
  expanded: { opacity: 1, x: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  collapsed: { opacity: 0, x: -8, transition: { duration: 0.14, ease: 'easeIn' } },
}

export const drawer: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.22, ease: 'easeOut' } },
  exit: { opacity: 0, x: 18, transition: { duration: 0.16, ease: 'easeIn' } },
}
