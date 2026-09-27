import { useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  FileText,
  FolderOpen,
  MapPin,
  UserRound,
  Users,
  WalletCards,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useI18n } from '../../contexts/I18nContext'
import { employees, holidays, leaveRequests, leaveTypes, notifications } from '../../data/mock'
import type { Employee } from '../../types/models'
import {
  calculateProfileCompletion,
  daysUntil,
  employeeFullName,
  formatDate,
  formatWeekday,
  getGreeting,
  getWeekDays,
  isSameDay,
  nextPayday,
  resolveEmployee,
} from '../../utils/employeeHelpers'
import { employeeDashboardTranslations } from './translations'
import {
  EmptyState,
  NotificationItem,
  ProgressBar,
  SectionLink,
  StatusBadge,
} from './components'

export function EmployeeDashboard() {
  const { currentUser } = useAuth()
  const { language } = useI18n()
  const t = employeeDashboardTranslations[language]
  const [dismissedProfileReminder, setDismissedProfileReminder] = useState(false)
  const [clockedIn, setClockedIn] = useState(true)
  const [clockedAt] = useState('08:46')
  const [visibleNotifications, setVisibleNotifications] = useState(notifications.map((item) => item.id))

  const employee = resolveEmployee(currentUser, employees)

  const myLeave = useMemo(() => {
    if (!employee) return []
    const fullName = employeeFullName(employee)
    return leaveRequests.filter((request) => request.employee === fullName)
  }, [employee])

  if (!currentUser) {
    return (
      <div className="page">
        <div className="empty-block">{t.loading}</div>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="page">
        <div className="empty-block">{t.notFound}</div>
      </div>
    )
  }

  const { percentage: profileCompletion, missing: missingFields } = calculateProfileCompletion(employee)
  const pendingRequests = myLeave.filter((request) => request.status === 'Pending')
  const annual = leaveTypes[0]
  const remaining = annual.balance - annual.used
  const upcomingHolidays = holidays
    .map((holiday) => ({ ...holiday, inDays: daysUntil(holiday.date) }))
    .filter((holiday) => holiday.inDays >= 0)
    .sort((a, b) => a.inDays - b.inDays)
  const nextHoliday = upcomingHolidays[0]
  const payday = nextPayday()
  const paydayIn = daysUntil(payday.toISOString())
  const team = employees.filter(
    (person) => person.department === employee.department && person.id !== employee.id,
  )
  const week = getWeekDays()
  const today = new Date()
  const inbox = visibleNotifications
    .map((id) => notifications.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))

  return (
    <div className="page employee-home">
      <section className="employee-hero">
        <div className="employee-hero-main">
          <div className="avatar employee-hero-avatar">{employee.initials}</div>
          <div className="employee-hero-copy">
            <span className="eyebrow">{t.workspace}</span>
            <h1>
              {getGreeting(language)}, {employee.firstName}
            </h1>
            <p>
              {employee.jobTitle}
              <i />
              {employee.department}
              <i />
              <MapPin size={13} />
              {employee.location}
            </p>
            <div className="employee-hero-meta">
              <span>
                {t.employeeId} EMP-{employee.id}
              </span>
              <span>
                {t.reportsTo} {employee.manager}
              </span>
              <span className={`clock-chip ${clockedIn ? 'in' : 'out'}`}>
                <Clock3 size={13} />
                {clockedIn ? `${t.clockedIn} ${t.since} ${clockedAt}` : t.clockedOut}
              </span>
            </div>
          </div>
        </div>

        <div className="employee-hero-actions">
          <button
            className="button secondary"
            onClick={() => setClockedIn((value) => !value)}
          >
            <Clock3 size={16} />
            {clockedIn ? t.clockOut : t.clockIn}
          </button>
          <Link to="/employee/leave" className="button primary">
            <CalendarDays size={16} />
            {t.requestLeave}
          </Link>
        </div>
      </section>

      {!dismissedProfileReminder && profileCompletion < 100 && (
        <section className="profile-nudge">
          <div className="profile-nudge-copy">
            <strong>{t.profileCompletion}</strong>
            <p>{t.completeYourProfile}</p>
            <ProgressBar percentage={profileCompletion} tone="orange" />
            <small>
              {profileCompletion}% · {missingFields.map((field) => t[field as keyof typeof t] || field).join(' · ')}
            </small>
          </div>
          <div className="profile-nudge-actions">
            <Link to="/employee/profile" className="button primary">
              {t.completeProfile}
            </Link>
            <button className="button ghost" onClick={() => setDismissedProfileReminder(true)}>
              {t.remindMeLater}
            </button>
          </div>
        </section>
      )}

      <section className="kpi-grid employee-kpis">
        <article className="kpi-card">
          <div className="kpi-icon">
            <CalendarDays size={18} />
          </div>
          <span className="kpi-label">{t.leaveBalance}</span>
          <strong className="kpi-value">
            {remaining}
            <small>{t.days}</small>
          </strong>
          <div className="kpi-trend">
            {annual.used} {t.leaveUsed}
          </div>
        </article>

        <article className="kpi-card">
          <div className="kpi-icon warning">
            <Clock3 size={18} />
          </div>
          <span className="kpi-label">{t.pendingRequests}</span>
          <strong className="kpi-value">{pendingRequests.length}</strong>
          <div className="kpi-trend warning-text">{t.awaitingManager}</div>
        </article>

        <article className="kpi-card">
          <div className="kpi-icon">
            <WalletCards size={18} />
          </div>
          <span className="kpi-label">{t.nextPayday}</span>
          <strong className="kpi-value">
            {paydayIn}
            <small>{t.days}</small>
          </strong>
          <div className="kpi-trend">
            {formatDate(payday.toISOString(), language)} · {t.payslipNet}
          </div>
        </article>

        <article className="kpi-card">
          <div className="kpi-icon">
            <Users size={18} />
          </div>
          <span className="kpi-label">{t.upcomingHolidays}</span>
          <strong className="kpi-value">
            {nextHoliday ? nextHoliday.inDays : '—'}
            {nextHoliday ? <small>{t.days}</small> : null}
          </strong>
          <div className="kpi-trend">{nextHoliday ? nextHoliday.name : t.noUpcomingHolidays}</div>
        </article>
      </section>

      <section className="panel quick-actions-panel">
        <div className="panel-title">
          <div>
            <h2>{t.iNeedTo}</h2>
            <span>{t.welcomeMessage}</span>
          </div>
        </div>
        <div className="quick-actions">
          <QuickAction to="/employee/leave" icon={<CalendarDays size={18} />} label={t.requestTimeOff} />
          <QuickAction to="/employee/documents" icon={<FileText size={18} />} label={t.seePayslip} />
          <QuickAction to="/employee/profile" icon={<UserRound size={18} />} label={t.updateInfo} />
          <QuickAction to="/employee/documents" icon={<FolderOpen size={18} />} label={t.downloadDocs} />
          <QuickAction to="/employee/dashboard#team" icon={<Users size={18} />} label={t.seeTeam} />
          <QuickAction to="/employee/holidays" icon={<CalendarDays size={18} />} label={t.viewCalendar} />
        </div>
      </section>

      <div className="employee-grid">
        <section className="panel">
          <div className="panel-title">
            <div>
              <h2>{t.leaveBalances}</h2>
              <span>
                {remaining} {t.days} {t.remaining}
              </span>
            </div>
            <SectionLink to="/employee/leave">{t.viewAll}</SectionLink>
          </div>

          <div className="leave-balances">
            {leaveTypes.map((type) => {
              const available = type.balance - type.used
              const usedPercent = Math.round((type.used / type.balance) * 100)
              const tone = type.id === 'sick' ? 'orange' : type.id === 'unpaid' ? 'purple' : 'blue'
              return (
                <div className="leave-balance-row" key={type.id}>
                  <div>
                    <strong>{type.name}</strong>
                    <span>
                      {available} {t.available} · {type.used} {t.used} · {type.balance} {t.of} {type.balance}
                    </span>
                  </div>
                  <b>
                    {available}
                    <small>{t.days}</small>
                  </b>
                  <ProgressBar percentage={usedPercent} tone={tone} />
                </div>
              )
            })}
          </div>
        </section>

        <section className="panel payslip-card">
          <div className="panel-title">
            <div>
              <h2>{t.netPay}</h2>
              <span>{t.lastPayslip}</span>
            </div>
            <SectionLink to="/employee/documents">{t.viewPayslip}</SectionLink>
          </div>
          <strong className="payslip-amount">{t.payslipNet}</strong>
          <p>{t.payslipGross}</p>
          <small>{t.payslipNote}</small>
        </section>

        <section className="panel">
          <div className="panel-title">
            <div>
              <h2>{t.thisWeek}</h2>
              <span>{t.workingWeek}</span>
            </div>
          </div>
          <div className="week-strip">
            {week.map((day) => {
              const holiday = holidays.find((item) => {
                const parsed = Date.parse(item.date)
                return !Number.isNaN(parsed) && isSameDay(new Date(parsed), day)
              })
              const away = myLeave.some((request) => {
                const start = Date.parse(request.start)
                const end = Date.parse(request.end)
                if (Number.isNaN(start) || Number.isNaN(end)) return false
                const time = day.getTime()
                return time >= start && time <= end && request.status !== 'Rejected'
              })
              return (
                <div
                  className={`week-day ${isSameDay(day, today) ? 'today' : ''} ${holiday ? 'holiday' : ''} ${away ? 'away' : ''}`}
                  key={day.toISOString()}
                >
                  <span>{formatWeekday(day, language)}</span>
                  <strong>{day.getDate()}</strong>
                  <small>
                    {holiday ? holiday.name : away ? t.onLeaveToday : isSameDay(day, today) ? t.today : ''}
                  </small>
                </div>
              )
            })}
          </div>
        </section>

        <section className="panel" id="team">
          <div className="panel-title">
            <div>
              <h2>{t.teamMembers}</h2>
              <span>
                {team.length + 1} {t.inYourDepartment}
              </span>
            </div>
          </div>
          {team.length ? (
            <div className="team-list">
              {team.map((person) => (
                <TeamRow key={person.id} person={person} t={t} />
              ))}
            </div>
          ) : (
            <EmptyState title={t.noTeam} />
          )}
        </section>

        <section className="panel employee-span">
          <div className="panel-title">
            <div>
              <h2>{t.myRequests}</h2>
              <span>
                {pendingRequests.length} {t.pending}
              </span>
            </div>
            <SectionLink to="/employee/leave">{t.viewAll}</SectionLink>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{t.type}</th>
                  <th>{t.dateRange}</th>
                  <th>{t.duration}</th>
                  <th>{t.backup}</th>
                  <th>{t.status}</th>
                </tr>
              </thead>
              <tbody>
                {myLeave.length ? (
                  myLeave.slice(0, 4).map((request) => (
                    <tr key={request.id}>
                      <td>{request.type}</td>
                      <td>
                        {formatDate(request.start, language)} – {formatDate(request.end, language)}
                      </td>
                      <td>
                        {request.duration} {request.duration === 1 ? t.day : t.days}
                      </td>
                      <td>{request.backup}</td>
                      <td>
                        <StatusBadge status={request.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>
                      <EmptyState title={t.noLeaveRequests} />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <div className="panel-title">
            <div>
              <h2>{t.notifications}</h2>
              <span>{t.inboxSubtitle}</span>
            </div>
          </div>
          {inbox.length ? (
            inbox.map((item) => (
              <NotificationItem
                key={item.id}
                notification={item}
                dismissLabel={t.dismissNotification}
                onDismiss={(id) => setVisibleNotifications((current) => current.filter((value) => value !== id))}
              />
            ))
          ) : (
            <EmptyState title={t.noNotifications} />
          )}
        </section>

        <section className="panel">
          <div className="panel-title">
            <div>
              <h2>{t.upcomingHolidays}</h2>
              <span>{t.holidaysSubtitle}</span>
            </div>
            <SectionLink to="/employee/holidays">{t.viewAll}</SectionLink>
          </div>
          {upcomingHolidays.length ? (
            <ul className="holiday-list">
              {upcomingHolidays.slice(0, 3).map((holiday) => (
                <li key={holiday.id}>
                  <div>
                    <strong>{holiday.name}</strong>
                    <span>
                      {holiday.type === 'Public' ? t.publicHoliday : t.companyHoliday} · {holiday.inDays} {t.daysAway}
                    </span>
                  </div>
                  <time>{formatDate(holiday.date, language)}</time>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title={t.noUpcomingHolidays} />
          )}
        </section>
      </div>
    </div>
  )
}

function QuickAction({
  to,
  icon,
  label,
}: {
  to: string
  icon: ReactNode
  label: string
}) {
  return (
    <Link to={to} className="quick-action">
      <span className="quick-action-icon">{icon}</span>
      <strong>{label}</strong>
      <ArrowRight size={15} />
    </Link>
  )
}

function TeamRow({
  person,
  t,
}: {
  person: Employee
  t: (typeof employeeDashboardTranslations)['en']
}) {
  return (
    <div className="team-row">
      <div className="avatar">{person.initials}</div>
      <div>
        <strong>{employeeFullName(person)}</strong>
        <span>{person.jobTitle}</span>
      </div>
      <StatusBadge status={person.status === 'On Leave' ? t.onLeaveToday : t.availableToday} />
    </div>
  )
}
