import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export interface BreadcrumbItem {
  label: string
  path?: string
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const navigate = useNavigate()

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {items.map((item, index) => (
          <li key={index} className="breadcrumb-item">
            {item.path && item.path !== '' ? (
              <button
                className="breadcrumb-link"
                onClick={() => navigate(item.path as string)}
                aria-current={index === items.length - 1 ? 'page' : undefined}
              >
                {item.label}
              </button>
            ) : (
              <span className="breadcrumb-current">{item.label}</span>
            )}

            {index < items.length - 1 && (
              <ChevronRight size={16} className="breadcrumb-separator" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
