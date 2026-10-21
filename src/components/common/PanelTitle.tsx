import { ChevronRight } from 'lucide-react'
import type { MouseEventHandler } from 'react'

export function PanelTitle({
  title,
  subtitle,
  action,
  onAction,
}: {
  title: string
  subtitle: string
  action: string
  onAction?: MouseEventHandler<HTMLButtonElement>
}) {
  return (
    <div className="panel-title">
      <div>
        <h2>{title}</h2>
        <span>{subtitle}</span>
      </div>

      {action && onAction ? (
        <button type="button" className="text-button" onClick={onAction}>
          {action}
          <ChevronRight size={14} />
        </button>
      ) : action ? (
        <span className="panel-action-label">{action}</span>
      ) : null}
    </div>
  )
}
