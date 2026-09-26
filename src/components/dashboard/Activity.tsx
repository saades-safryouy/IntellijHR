import type { ReactNode } from 'react'

export function Activity({
  icon,
  title,
  detail,
  time,
}: {
  icon: ReactNode
  title: string
  detail: string
  time: string
}) {
  return (
    <div className="activity">
      <div className="activity-icon">{icon}</div>

      <div>
        <strong>{title}</strong>
        <span>{detail}</span>
      </div>

      <time>{time}</time>
    </div>
  )
}
