import { ChevronRight } from 'lucide-react'

export function PanelTitle({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle: string
  action: string
}) {
  return (
    <div className="panel-title">
      <div>
        <h2>{title}</h2>
        <span>{subtitle}</span>
      </div>

      <button className="text-button">
        {action}
        <ChevronRight size={14} />
      </button>
    </div>
  )
}
