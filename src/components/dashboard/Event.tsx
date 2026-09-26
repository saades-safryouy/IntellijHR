import { ChevronRight } from 'lucide-react'

export function Event({
  date,
  time,
  title,
  detail,
  color,
}: {
  date: string
  time: string
  title: string
  detail: string
  color: string
}) {
  return (
    <div className="event">
      <div className={`event-date ${color}`}>
        <strong>{date}</strong>
        <span>{time}</span>
      </div>

      <div>
        <strong>{title}</strong>
        <span>{detail}</span>
      </div>

      <ChevronRight size={15} />
    </div>
  )
}
