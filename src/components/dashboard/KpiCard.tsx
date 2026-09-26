import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { sidebarLabels } from '../../lib/motion'
import { AnimatedMetric } from './AnimatedMetric'

export function KpiCard({
  label,
  value,
  trend,
  note,
  icon,
  warning = false,
}: {
  label: string
  value: string
  trend: string
  note: string
  icon: ReactNode
  warning?: boolean
}) {
  return (
    <motion.div
      className="kpi-card"
      variants={sidebarLabels}
      initial="collapsed"
      animate="expanded"
      whileHover={{
        y: -3,
        transition: {
          duration: 0.16,
        },
      }}
    >
      <div className={`kpi-icon ${warning ? 'warning' : ''}`}>{icon}</div>

      <span className="kpi-label">{label}</span>

      <strong className="kpi-value">
        <AnimatedMetric value={value} />
      </strong>

      <div className={`kpi-trend ${warning ? 'warning-text' : ''}`}>
        {!warning && <ArrowRight size={14} />}
        {trend}
        <small>{note}</small>
      </div>
    </motion.div>
  )
}
