import { useState, type FormEvent } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useI18n } from '../../contexts/I18nContext'
import { PageHeader } from '../../components/common/PageHeader'
import {
  cancelLeaveRequest,
  getEmployees,
  getHolidays,
  getLeaveEntitlements,
  getLeaveRequests,
  getLeaveTypes,
  resolveEmployee,
  submitLeaveRequest,
} from '../../data/employeeStore'
import type { HalfDay, LeaveRequest } from '../../types/models'
import { employeeFullName, formatDate } from '../../utils/employeeHelpers'
import { calculateLeaveBalances, hasLeaveOverlap, workingLeaveDays } from '../../utils/leave'
import { employeeDashboardTranslations } from './translations'
import { EmptyState, ProgressBar, StatusBadge } from './components'
import { useEmployeeStore } from '../../hooks/useEmployeeStore'

export function EmployeeLeavePage() {
  useEmployeeStore()
  const { currentUser } = useAuth()
  const { language } = useI18n()
  const t = employeeDashboardTranslations[language]
  const employee = resolveEmployee(currentUser)
  const [open, setOpen] = useState(false)
  const [detail, setDetail] = useState<LeaveRequest | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const types = getLeaveTypes()
  const colleagues = getEmployees().filter((person) => person.userId !== employee?.userId)
  const requests = employee
    ? getLeaveRequests().filter((request) => request.userId === employee.userId)
    : []

  if (!employee) {
    return (
      <div className="page">
        <div className="empty-block">{t.notFound}</div>
      </div>
    )
  }

  const balances = calculateLeaveBalances(employee.userId, types, getLeaveEntitlements(), getLeaveRequests())

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    const data = new FormData(event.currentTarget)
    const typeId = String(data.get('type') || types[0].id)
    const start = String(data.get('start') || '')
    const end = String(data.get('end') || start)
    const fromHalf = String(data.get('fromHalf') || 'full') as HalfDay
    const toHalf = String(data.get('toHalf') || 'full') as HalfDay
    const note = String(data.get('note') || '')
    const backupUserIdRaw = String(data.get('backup') || '')
    const backupUserId = backupUserIdRaw ? Number(backupUserIdRaw) : null
    const backupPerson = colleagues.find((person) => person.userId === backupUserId)

    if (!start || !end || end < start) {
      setError(t.invalidDates)
      return
    }

    const duration = workingLeaveDays(start, end, getHolidays(), employee, fromHalf, toHalf)
    if (duration <= 0) {
      setError(t.invalidDates)
      return
    }

    if (hasLeaveOverlap(getLeaveRequests(), employee.userId, start, end)) {
      setError(t.overlapError)
      return
    }

    const balance = balances.find((item) => item.type.id === typeId)
    if (balance && duration > balance.remaining) {
      setError(t.insufficientBalance)
      return
    }

    submitLeaveRequest({
      userId: employee.userId,
      employee: employeeFullName(employee),
      typeId,
      type: typeId,
      start,
      end,
      fromHalf,
      toHalf,
      duration,
      backup: backupPerson ? employeeFullName(backupPerson) : '',
      backupUserId,
      note,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    })
    setOpen(false)
    setMessage(t.requestSent)
  }

  const cancelPending = (request: LeaveRequest) => {
    if (!window.confirm(t.cancelConfirm)) return
    if (cancelLeaveRequest(request.id, employee.userId)) {
      setDetail(null)
      setMessage(t.requestCancelled)
    }
  }

  return (
    <div className="page employee-page">
      <PageHeader eyebrow={t.employeePortal} title={t.leavePageTitle} subtitle={t.leavePageSubtitle}>
        <button className="button primary" onClick={() => setOpen(true)}>
          {t.newRequest}
        </button>
      </PageHeader>

      {message && <div className="toast-inline">{message}</div>}
      {error && !open && <div className="toast-inline toast-error">{error}</div>}

      <section className="kpi-grid employee-kpis">
        {balances.map((balance) => {
          const usedPercent = balance.entitlement ? Math.round((balance.used / balance.entitlement) * 100) : 0
          return (
            <article className="kpi-card" key={balance.type.id}>
              <span className="kpi-label">{t[balance.type.nameKey as keyof typeof t] || balance.type.nameKey}</span>
              <strong className="kpi-value">
                {balance.remaining}
                <small>{t.days}</small>
              </strong>
              <ProgressBar
                percentage={usedPercent}
                tone={balance.type.id === 'sick' ? 'orange' : balance.type.id === 'unpaid' ? 'purple' : 'blue'}
                label={`${balance.remaining} ${t.days}`}
              />
              <div className="kpi-trend">
                {balance.used} {t.used} · {balance.pending} {t.pending} · {balance.entitlement} {t.of} {balance.entitlement}
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
              {requests.filter((request) => request.status === 'pending').length} {t.pending}
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
              {requests.length ? (
                requests.map((request) => (
                  <tr key={request.id} onClick={() => setDetail(request)} style={{ cursor: 'pointer' }}>
                    <td>{request.id}</td>
                    <td>{t[request.typeId === 'sick' ? 'leaveSick' : request.typeId === 'unpaid' ? 'leaveUnpaid' : 'leaveAnnual']}</td>
                    <td>
                      {formatDate(request.start, language)} – {formatDate(request.end, language)}
                    </td>
                    <td>
                      {request.duration} {request.duration === 1 ? t.day : t.days}
                    </td>
                    <td>{request.backup || t.none}</td>
                    <td>
                      <StatusBadge
                        status={request.status}
                        label={t[request.status === 'approved' ? 'statusApproved' : request.status === 'rejected' ? 'statusRejected' : request.status === 'cancelled' ? 'statusCancelled' : 'statusPending']}
                      />
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
        <LeaveDrawer
          t={t}
          types={types}
          colleagues={colleagues}
          employee={employee}
          error={error}
          onClose={() => { setOpen(false); setError('') }}
          onSubmit={submit}
        />
      )}

      {detail && (
        <div className="drawer-backdrop" onClick={() => setDetail(null)}>
          <aside className="employee-drawer leave-drawer" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
            <div className="drawer-header">
              <span>{detail.id}</span>
              <button className="icon-button" onClick={() => setDetail(null)} aria-label={t.cancel}>
                ×
              </button>
            </div>
            <div className="leave-form">
              <p><strong>{t.type}</strong> {t[detail.typeId === 'sick' ? 'leaveSick' : detail.typeId === 'unpaid' ? 'leaveUnpaid' : 'leaveAnnual']}</p>
              <p><strong>{t.dateRange}</strong> {formatDate(detail.start, language)} – {formatDate(detail.end, language)}</p>
              <p><strong>{t.duration}</strong> {detail.duration} {t.workingDays}</p>
              <p><strong>{t.backup}</strong> {detail.backup || t.none}</p>
              <p><strong>{t.note}</strong> {detail.note || '—'}</p>
              <p><strong>{t.submittedAt}</strong> {formatDate(detail.submittedAt, language)}</p>
              <p>
                <strong>{t.status}</strong>{' '}
                <StatusBadge
                  status={detail.status}
                  label={t[detail.status === 'approved' ? 'statusApproved' : detail.status === 'rejected' ? 'statusRejected' : detail.status === 'cancelled' ? 'statusCancelled' : 'statusPending']}
                />
              </p>
              {detail.status === 'pending' && (
                <button className="button secondary" onClick={() => cancelPending(detail)}>
                  {t.cancelRequest}
                </button>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}

function LeaveDrawer({
  t,
  types,
  colleagues,
  employee,
  error,
  onClose,
  onSubmit,
}: {
  t: (typeof employeeDashboardTranslations)[keyof typeof employeeDashboardTranslations]
  types: ReturnType<typeof getLeaveTypes>
  colleagues: ReturnType<typeof getEmployees>
  employee: NonNullable<ReturnType<typeof resolveEmployee>>
  error: string
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [fromHalf, setFromHalf] = useState<HalfDay>('full')
  const [toHalf, setToHalf] = useState<HalfDay>('full')
  const preview = start && end
    ? workingLeaveDays(start, end || start, getHolidays(), employee, fromHalf, toHalf)
    : 0

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className="employee-drawer leave-drawer" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <div className="drawer-header">
          <span>{t.newRequest}</span>
          <button className="icon-button" onClick={onClose} aria-label={t.cancel}>
            ×
          </button>
        </div>
        <form className="leave-form" onSubmit={onSubmit}>
          {error && <div className="toast-inline toast-error">{error}</div>}
          <label>
            {t.type}
            <select name="type" defaultValue={types[0].id}>
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {t[type.nameKey as keyof typeof t] || type.nameKey}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t.from}
            <input name="start" type="date" required value={start} onChange={(e) => setStart(e.target.value)} />
          </label>
          <label>
            {t.to}
            <input name="end" type="date" required value={end} onChange={(e) => setEnd(e.target.value)} />
          </label>
          <label>
            {t.fullDay} ({t.from})
            <select name="fromHalf" value={fromHalf} onChange={(e) => setFromHalf(e.target.value as HalfDay)}>
              <option value="full">{t.fullDay}</option>
              <option value="AM">{t.halfDayAM}</option>
              <option value="PM">{t.halfDayPM}</option>
            </select>
          </label>
          <label>
            {t.fullDay} ({t.to})
            <select name="toHalf" value={toHalf} onChange={(e) => setToHalf(e.target.value as HalfDay)}>
              <option value="full">{t.fullDay}</option>
              <option value="AM">{t.halfDayAM}</option>
              <option value="PM">{t.halfDayPM}</option>
            </select>
          </label>
          {preview > 0 && (
            <p className="missing-fields">
              {preview} {t.workingDays} {t.excludingHolidays}
            </p>
          )}
          <label>
            {t.backupColleague}
            <select name="backup" defaultValue="">
              <option value="">{t.selectBackup}</option>
              {colleagues.map((person) => (
                <option key={person.userId} value={person.userId}>
                  {employeeFullName(person)}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t.reason}
            <input name="note" placeholder={t.reason} />
          </label>
          <div className="leave-form-actions">
            <button type="button" className="button secondary" onClick={onClose}>
              {t.cancel}
            </button>
            <button type="submit" className="button primary">
              {t.submitRequest}
            </button>
          </div>
        </form>
      </aside>
    </div>
  )
}
