import { useMemo, useState, type FormEvent } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useI18n } from '../../contexts/I18nContext'
import { PageHeader } from '../../components/common/PageHeader'
import { employees, leaveRequests as seedRequests, leaveTypes } from '../../data/mock'
import type { LeaveRequest } from '../../types/models'
import {
  employeeFullName,
  formatDate,
  resolveEmployee,
} from '../../utils/employeeHelpers'
import { employeeDashboardTranslations } from './translations'
import { EmptyState, ProgressBar, StatusBadge } from './components'

export function EmployeeLeavePage() {
  const { currentUser } = useAuth()
  const { language } = useI18n()
  const t = employeeDashboardTranslations[language]
  const employee = resolveEmployee(currentUser, employees)
  const [open, setOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const [requests, setRequests] = useState(seedRequests)

  const myLeave = useMemo(() => {
    if (!employee) return []
    const fullName = employeeFullName(employee)
    return requests.filter((request) => request.employee === fullName)
  }, [employee, requests])

  if (!employee) {
    return (
      <div className="page">
        <div className="empty-block">{t.notFound}</div>
      </div>
    )
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const type = String(data.get('type') || leaveTypes[0].name)
    const start = String(data.get('start') || '')
    const end = String(data.get('end') || start)
    const startDate = new Date(start)
    const endDate = new Date(end)
    const duration = Math.max(
      1,
      Math.round((endDate.getTime() - startDate.getTime()) / 86400000) + 1,
    )

    const next: LeaveRequest = {
      id: `LV-${390 + requests.length}`,
      employee: employeeFullName(employee),
      type,
      start: startDate.toDateString(),
      end: endDate.toDateString(),
      duration,
      backup: employee.manager,
      status: 'Pending',
    }

    setRequests((current) => [next, ...current])
    setOpen(false)
    setSent(true)
  }

  return (
    <div className="page employee-page">
      <PageHeader eyebrow={t.employeePortal} title={t.leavePageTitle} subtitle={t.leavePageSubtitle}>
        <button className="button primary" onClick={() => setOpen(true)}>
          {t.newRequest}
        </button>
      </PageHeader>

      {sent && <div className="toast-inline">{t.requestSent}</div>}

      <section className="kpi-grid employee-kpis">
        {leaveTypes.map((type) => {
          const available = type.balance - type.used
          const usedPercent = Math.round((type.used / type.balance) * 100)
          return (
            <article className="kpi-card" key={type.id}>
              <span className="kpi-label">{type.name}</span>
              <strong className="kpi-value">
                {available}
                <small>{t.days}</small>
              </strong>
              <ProgressBar
                percentage={usedPercent}
                tone={type.id === 'sick' ? 'orange' : type.id === 'unpaid' ? 'purple' : 'blue'}
              />
              <div className="kpi-trend">
                {type.used} {t.used} · {type.balance} {t.of} {type.balance}
              </div>
            </article>
          )
        })}
      </section>

      <section className="panel">
        <div className="panel-title">
          <div>
            <h2>{t.myRequests}</h2>
            <span>
              {myLeave.filter((request) => request.status === 'Pending').length} {t.pending}
            </span>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>{t.type}</th>
                <th>{t.dateRange}</th>
                <th>{t.duration}</th>
                <th>{t.backup}</th>
                <th>{t.status}</th>
              </tr>
            </thead>
            <tbody>
              {myLeave.length ? (
                myLeave.map((request) => (
                  <tr key={request.id}>
                    <td>{request.id}</td>
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
                  <td colSpan={6}>
                    <EmptyState title={t.noLeaveRequests} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {open && (
        <div className="drawer-backdrop" onClick={() => setOpen(false)}>
          <aside className="employee-drawer leave-drawer" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-header">
              <span>{t.newRequest}</span>
              <button className="icon-button" onClick={() => setOpen(false)} aria-label={t.cancel}>
                ×
              </button>
            </div>
            <form className="leave-form" onSubmit={submit}>
              <label>
                {t.type}
                <select name="type" defaultValue={leaveTypes[0].name}>
                  {leaveTypes.map((type) => (
                    <option key={type.id} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {t.from}
                <input name="start" type="date" required />
              </label>
              <label>
                {t.to}
                <input name="end" type="date" required />
              </label>
              <label>
                {t.reason}
                <input name="note" placeholder={t.reason} />
              </label>
              <div className="leave-form-actions">
                <button type="button" className="button secondary" onClick={() => setOpen(false)}>
                  {t.cancel}
                </button>
                <button type="submit" className="button primary">
                  {t.submitRequest}
                </button>
              </div>
            </form>
          </aside>
        </div>
      )}
    </div>
  )
}
