import { useLocation } from 'react-router-dom'
import { Clock3 } from 'lucide-react'
import { useI18n } from '../../contexts/I18nContext'
import { futureModules } from '../../data/navigation'

export function ComingSoon() {
  const { text } = useI18n()
  const location = useLocation()

  const module =
    futureModules.find((item) =>
      location.pathname.includes(item.path.replace('/app/', '')),
    ) || futureModules[0]

  const Icon = module.icon

  return (
    <div className="page coming-page">
      <div className="coming-illustration">
        <Icon size={32} />
      </div>

      <span className="eyebrow">{text('EXTENDED MODULE')}</span>

      <h1>{text(module.title)}</h1>

      <p>{text(module.detail)}</p>

      <span className="coming-badge">
        <Clock3 size={14} />
        {text('Coming soon')}
      </span>
    </div>
  )
}
