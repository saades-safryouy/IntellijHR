import { AlertCircle, CheckCircle2, ClipboardCheck } from 'lucide-react'
import { notifications } from '../../data/mock'
import { useI18n } from '../../contexts/I18nContext'

export function NotificationPanel() {
  const { text } = useI18n()

  return (
    <div className="notification-panel">
      <div className="panel-heading">
        <strong>{text('Notifications')}</strong>
        <button>{text('Mark all read')}</button>
      </div>

      {notifications.map((notification) => (
        <div className="notification" key={notification.id}>
          <div className={`notification-icon ${notification.type}`}>
            {notification.type === 'warning' ? (
              <AlertCircle size={15} />
            ) : notification.type === 'success' ? (
              <CheckCircle2 size={15} />
            ) : (
              <ClipboardCheck size={15} />
            )}
          </div>

          <div>
            <strong>{text(notification.title)}</strong>
            <span>{text(notification.detail)}</span>
            <small>{text(notification.time)}</small>
          </div>
        </div>
      ))}
    </div>
  )
}
