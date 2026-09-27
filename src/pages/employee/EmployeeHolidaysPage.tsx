import { useI18n } from '../../contexts/I18nContext'
import { PageHeader } from '../../components/common/PageHeader'
import { holidays } from '../../data/mock'
import { daysUntil, formatDate } from '../../utils/employeeHelpers'
import { employeeDashboardTranslations } from './translations'
import { EmptyState } from './components'

export function EmployeeHolidaysPage() {
  const { language } = useI18n()
  const t = employeeDashboardTranslations[language]
  const upcoming = holidays
    .map((holiday) => ({ ...holiday, inDays: daysUntil(holiday.date) }))
    .sort((a, b) => a.inDays - b.inDays)

  return (
    <div className="page employee-page">
      <PageHeader eyebrow={t.employeePortal} title={t.holidaysTitle} subtitle={t.holidaysSubtitle} />

      <section className="panel">
        {upcoming.length ? (
          <ul className="holiday-board">
            {upcoming.map((holiday) => (
              <li key={holiday.id}>
                <time>{formatDate(holiday.date, language)}</time>
                <div>
                  <strong>{holiday.name}</strong>
                  <span>{holiday.type === 'Public' ? t.publicHoliday : t.companyHoliday}</span>
                </div>
                <em>
                  {holiday.inDays >= 0 ? `${holiday.inDays} ${t.daysAway}` : formatDate(holiday.date, language)}
                </em>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title={t.noUpcomingHolidays} />
        )}
      </section>
    </div>
  )
}
