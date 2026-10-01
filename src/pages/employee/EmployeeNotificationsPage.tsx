import { useAuth } from '../../contexts/AuthContext'
import { useI18n } from '../../contexts/I18nContext'
import { PageHeader } from '../../components/common/PageHeader'
import {
  getMyNotifications,
  getUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
  resolveEmployee,
} from '../../data/employeeStore'
import { employeeDashboardTranslations } from './translations'
import { EmptyState, NotificationItem } from './components'
import { useEmployeeStore } from '../../hooks/useEmployeeStore'

export function EmployeeNotificationsPage() {
  useEmployeeStore()
  const { currentUser } = useAuth()
  const { language } = useI18n()
  const t = employeeDashboardTranslations[language]
  const employee = resolveEmployee(currentUser)

  if (!employee) {
    return (
      <div className="page">
        <div className="empty-block">{t.notFound}</div>
      </div>
    )
  }

  const items = getMyNotifications(employee.userId)
  const unread = getUnreadCount(employee.userId)

  return (
    <div className="page employee-page">
      <PageHeader eyebrow={t.employeePortal} title={t.notifications} subtitle={t.inboxSubtitle}>
        {unread > 0 && (
          <button
            className="button secondary"
            onClick={() => {
              markAllNotificationsRead(employee.userId)
            }}
          >
            {t.markRead}
          </button>
        )}
      </PageHeader>

      <section className="panel">
        {items.length ? (
          items.map((item) => (
            <NotificationItem
              key={item.id}
              notification={item}
              t={t}
              language={language}
              dismissLabel={t.dismissNotification}
              onDismiss={(id) => {
                markNotificationRead(id)
              }}
            />
          ))
        ) : (
          <EmptyState title={t.noNotifications} />
        )}
      </section>
    </div>
  )
}
