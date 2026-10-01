import { AlertCircle, CheckCircle2, ClipboardCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useI18n } from '../../contexts/I18nContext'
import {
  getMyNotifications,
  getUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
  resolveEmployee,
} from '../../data/employeeStore'
import { formatDate } from '../../utils/dates'
import { employeeDashboardTranslations, interpolate, notifTitleKey } from '../../pages/employee/translations'
import { useEmployeeStore } from '../../hooks/useEmployeeStore'

export function EmployeeNotificationPanel() {
  useEmployeeStore()
  const { currentUser } = useAuth()
  const { language } = useI18n()
  const t = employeeDashboardTranslations[language]
  const employee = resolveEmployee(currentUser)
  const items = employee ? getMyNotifications(employee.userId).slice(0, 6) : []
  const unread = employee ? getUnreadCount(employee.userId) : 0

  return (
    <div className="notification-panel">
      <div className="panel-heading">
        <strong>{t.notifications}</strong>
        {unread > 0 && employee && (
          <button onClick={() => markAllNotificationsRead(employee.userId)}>{t.markRead}</button>
        )}
      </div>

      {items.length ? (
        items.map((notification) => {
          const title = interpolate(t[notifTitleKey(notification.type)], notification.params)
          return (
            <button
              className="notification"
              key={notification.id}
              onClick={() => markNotificationRead(notification.id)}
            >
              <div
                className={`notification-icon ${
                  notification.type.startsWith('passport') || notification.type === 'leave-rejected'
                    ? 'warning'
                    : notification.type === 'leave-approved'
                      ? 'success'
                      : 'info'
                }`}
              >
                {notification.type.startsWith('passport') || notification.type === 'leave-rejected' ? (
                  <AlertCircle size={15} />
                ) : notification.type === 'leave-approved' ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <ClipboardCheck size={15} />
                )}
              </div>
              <div>
                <strong>{title}</strong>
                <span>{notification.params?.requestId ?? ''}</span>
                <small>{formatDate(notification.createdAt, language)}</small>
              </div>
            </button>
          )
        })
      ) : (
        <div className="notification">
          <div>
            <strong>{t.noNotifications}</strong>
          </div>
        </div>
      )}

      <Link to="/employee/notifications" className="text-button" style={{ padding: '10px 14px' }}>
        {t.viewAll}
      </Link>
    </div>
  )
}
