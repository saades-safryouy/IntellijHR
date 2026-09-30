import { useMemo, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useI18n } from '../../contexts/I18nContext'
import { PageHeader } from '../../components/common/PageHeader'
import { getHolidays, resolveEmployee } from '../../data/employeeStore'
import { daysUntil, formatDate } from '../../utils/dates'
import { holidayAppliesToEmployee, holidaysForYear, uniqueYears } from '../../utils/holidays'
import { employeeDashboardTranslations } from './translations'
import { EmptyState } from './components'

export function EmployeeHolidaysPage() {
  const { currentUser } = useAuth()
  const { language } = useI18n()
  const t = employeeDashboardTranslations[language]
  const employee = resolveEmployee(currentUser)
  const holidays = getHolidays()
  const years = uniqueYears(holidays)
  const [year, setYear] = useState(new Date().getFullYear())
  const [country, setCountry] = useState(employee?.country ?? '')

  const countries = useMemo(() => {
    const set = new Set(holidays.map((holiday) => holiday.country).filter(Boolean) as string[])
    return [...set]
  }, [holidays])

  const visible = holidaysForYear(holidays, year)
    .filter((holiday) => {
      if (country && holiday.country && holiday.country !== country) return false
      if (employee && !country) return holidayAppliesToEmployee(holiday, employee) || !holiday.country
      return true
    })
    .map((holiday) => ({ ...holiday, inDays: daysUntil(holiday.date) }))
    .sort((a, b) => a.inDays - b.inDays)

  return (
    <div className="page employee-page">
      <PageHeader eyebrow={t.employeePortal} title={t.holidaysTitle} subtitle={t.holidaysSubtitle}>
        <label className="filter-control">
          {t.year}
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} aria-label={t.year}>
            {years.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        {countries.length > 0 && (
          <label className="filter-control">
            {t.location}
            <select value={country} onChange={(e) => setCountry(e.target.value)} aria-label={t.location}>
              <option value="">{t.allCountries}</option>
              {countries.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        )}
      </PageHeader>

      <section className="panel">
        {visible.length ? (
          <ul className="holiday-board">
            {visible.map((holiday) => (
              <li key={`${holiday.id}-${holiday.date}`} className={holiday.type === 'Public' ? 'holiday-public' : 'holiday-company'}>
                <time>{formatDate(holiday.date, language)}</time>
                <div>
                  <strong>{t[holiday.nameKey as keyof typeof t] || holiday.name}</strong>
                  <span>
                    {holiday.type === 'Public' ? t.publicHoliday : t.companyHoliday}
                    {holiday.recurring ? ` · ${t.recurring}` : ''}
                    {holiday.country ? ` · ${holiday.country}` : ''}
                    {holiday.site ? ` · ${holiday.site}` : ''}
                  </span>
                </div>
                <em>
                  {holiday.days} {holiday.days === 1 ? t.day : t.days}
                  {holiday.inDays >= 0 ? ` · ${holiday.inDays} ${t.daysAway}` : ''}
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
