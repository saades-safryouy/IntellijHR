import { useMemo, useState, type CSSProperties, type FormEvent } from 'react'
import { Plus, FileText } from 'lucide-react'
import { PageHeader } from '../../components/common/PageHeader'
import { Breadcrumb } from '../../components/common/Breadcrumb'
import { StatusBadge } from '../../components/employees/StatusBadge'
import {
  approveLeaveRequest,
  getEmployees,
  getHolidays,
  getLeaveRequests,
  getLeaveTypes,
  rejectLeaveRequest,
  submitLeaveRequest,
} from '../../data/employeeStore'
import { downloadFile, generateCsv } from '../../components/dashboard/DashboardUtils'
import { useEmployeeStore } from '../../hooks/useEmployeeStore'
import { employeeFullName } from '../../utils/employeeHelpers'
import { employeeDashboardTranslations } from '../employee/translations'
import { hasLeaveOverlap, workingLeaveDays } from '../../utils/leave'
import { translations } from '../../contexts/I18nContext'
import { useI18n } from '../../contexts/I18nContext'
import type { HalfDay, LeaveStatus } from '../../types/models'

interface LeaveForm {
  employeeId: string
  typeId: string
  start: string
  end: string
  fromHalf: HalfDay
  toHalf: HalfDay
  backupUserId: string
  note: string
}

const initialForm = (): LeaveForm => ({
  employeeId: '',
  typeId: '',
  start: '',
  end: '',
  fromHalf: 'full',
  toHalf: 'full',
  backupUserId: '',
  note: '',
})

export function LeavePage() {
  useEmployeeStore()
  const { language } = useI18n()
  const t = translations[language]
  const employeeCopy = employeeDashboardTranslations[language]
  const [status, setStatus] = useState<LeaveStatus | 'all'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<LeaveForm>(initialForm)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const employees = getEmployees().filter((employee) => employee.status !== 'Terminated')
  const types = getLeaveTypes()
  const leaveRequests = getLeaveRequests()
  const selectedEmployee = employees.find((employee) => String(employee.userId) === form.employeeId)
  const previewDuration =
    selectedEmployee && form.start && form.end
      ? workingLeaveDays(form.start, form.end, getHolidays(), selectedEmployee, form.fromHalf, form.toHalf)
      : 0

  const filtered = useMemo(
    () =>
      status === 'all'
        ? leaveRequests
        : leaveRequests.filter((req) => req.status === status),
    [leaveRequests, status],
  )

  const stats = useMemo(
    () => ({
      total: leaveRequests.length,
      pending: leaveRequests.filter((req) => req.status === 'pending').length,
      approved: leaveRequests.filter((req) => req.status === 'approved').length,
      rejected: leaveRequests.filter((req) => req.status === 'rejected').length,
    }),
    [leaveRequests],
  )

  const handleApprove = (requestId: string) => {
    if (approveLeaveRequest(requestId)) {
      setFeedback('Leave request approved.')
      setExpandedId(null)
    }
  }

  const handleReject = (requestId: string) => {
    if (rejectLeaveRequest(requestId)) {
      setFeedback('Leave request rejected.')
      setExpandedId(null)
    }
  }

  const exportRequests = () => {
    const csv = generateCsv(
      ['Request ID', 'Employee', 'Leave type', 'Start date', 'End date', 'Duration', 'Backup', 'Status', 'Submitted'],
      leaveRequests.map((request) => [
        request.id,
        request.employee,
        request.type,
        request.start,
        request.end,
        request.duration,
        request.backup,
        request.status,
        request.submittedAt,
      ]),
    )
    downloadFile(csv, 'leave-requests.csv')
  }

  const submitRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    const employee = employees.find((item) => String(item.userId) === form.employeeId)
    const type = types.find((item) => item.id === form.typeId)
    if (!employee || !type) {
      setError('Select an employee and leave type.')
      return
    }
    if (!form.start || !form.end || form.end < form.start || previewDuration <= 0) {
      setError('Choose a valid date range with at least one working day.')
      return
    }
    if (hasLeaveOverlap(leaveRequests, employee.userId, form.start, form.end)) {
      setError('This employee already has a leave request overlapping those dates.')
      return
    }
    const backup = employees.find((person) => String(person.userId) === form.backupUserId)
    submitLeaveRequest({
      userId: employee.userId,
      employee: employeeFullName(employee),
      typeId: type.id,
      type: employeeCopy[type.nameKey as keyof typeof employeeCopy] ?? type.nameKey,
      start: form.start,
      end: form.end,
      fromHalf: form.fromHalf,
      toHalf: form.toHalf,
      duration: previewDuration,
      backup: backup ? employeeFullName(backup) : '',
      backupUserId: backup?.userId ?? null,
      note: form.note.trim(),
      status: 'pending',
      submittedAt: new Date().toISOString(),
    })
    setFormOpen(false)
    setForm(initialForm())
    setFeedback('Leave request created.')
  }

  const openForm = () => {
    setError('')
    setForm({
      ...initialForm(),
      employeeId: employees[0] ? String(employees[0].userId) : '',
      typeId: types[0]?.id ?? '',
    })
    setFormOpen(true)
  }

  return (
    <div className="page">
      <Breadcrumb
        items={[
          { label: t.leave.label },
        ]}
      />

      <PageHeader
        eyebrow={`LEAVE · ${stats.total} REQUESTS`}
        title={t.leave.label}
        subtitle="Manage and track employee leave requests."
      >
        <button type="button" className="button secondary" onClick={exportRequests} disabled={!leaveRequests.length}>
          <FileText size={16} />
          {t.export}
        </button>

        <button
          type="button"
          className="button primary"
          onClick={openForm}
        >
          <Plus size={16} />
          {t.create}
        </button>
      </PageHeader>
      {feedback && <div className="toast-inline" role="status">{feedback}</div>}

      <section className="stats-grid">
        <div className="stat-card">
          <span>Total Requests</span>
          <strong>{stats.total}</strong>
        </div>
        <div className="stat-card">
          <span>Pending</span>
          <strong className="warning-text">{stats.pending}</strong>
        </div>
        <div className="stat-card">
          <span>Approved</span>
          <strong className="success-text">{stats.approved}</strong>
        </div>
        <div className="stat-card">
          <span>Rejected</span>
          <strong>{stats.rejected}</strong>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3>Leave Requests</h3>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as LeaveStatus | 'all')}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="leave-list">
          {filtered.length > 0 ? (
            filtered.map((request) => (
              <div key={request.id} className="leave-item">
                <button
                  type="button"
                  className="leave-info leave-info-button"
                  aria-expanded={expandedId === request.id}
                  onClick={() => setExpandedId(expandedId === request.id ? null : request.id)}
                >
                  <span
                    className="leave-type-badge"
                    style={{ '--leave-type-color': types.find((type) => type.id === request.typeId)?.color ?? '#64748b' } as CSSProperties}
                  >
                    {request.type.substring(0, 2).toUpperCase()}
                  </span>
                  <span className="leave-person">
                    <strong>{request.employee}</strong>
                    <small>{request.type} · {request.start} to {request.end} ({request.duration} days)</small>
                  </span>
                  <StatusBadge status={request.status} />
                </button>
                {request.status === 'pending' && (
                  <div className="leave-actions">
                    <button type="button" className="button secondary" onClick={() => handleReject(request.id)}>
                      Reject
                    </button>
                    <button type="button" className="button primary" onClick={() => handleApprove(request.id)}>
                      Approve
                    </button>
                  </div>
                )}

                {expandedId === request.id && (
                  <div className="leave-details">
                    <div><span>Request ID</span><strong>{request.id}</strong></div>
                    <div><span>Backup</span><strong>{request.backup || 'None'}</strong></div>
                    <div><span>Submitted</span><strong>{new Date(request.submittedAt).toLocaleString()}</strong></div>
                    <div><span>Half days</span><strong>{request.fromHalf} / {request.toHalf}</strong></div>
                    {request.note && (
                      <div className="leave-note">
                        <span>Note</span>
                        <strong>{request.note}</strong>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No leave requests found</p>
            </div>
          )}
        </div>
      </section>
      {formOpen && (
        <div className="drawer-backdrop" onClick={() => setFormOpen(false)}>
          <aside className="employee-drawer leave-drawer" role="dialog" aria-modal="true" aria-labelledby="hr-leave-title" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-header">
              <span id="hr-leave-title">Create leave request</span>
              <button type="button" className="icon-button" onClick={() => setFormOpen(false)} aria-label="Close">×</button>
            </div>
            <form className="leave-form" onSubmit={submitRequest}>
              {error && <div className="toast-inline toast-error" role="alert">{error}</div>}
              <label>Employee
                <select required value={form.employeeId} onChange={(event) => setForm({ ...form, employeeId: event.target.value })}>
                  {employees.map((employee) => <option key={employee.userId} value={employee.userId}>{employeeFullName(employee)}</option>)}
                </select>
              </label>
              <label>Leave type
                <select required value={form.typeId} onChange={(event) => setForm({ ...form, typeId: event.target.value })}>
                  {types.map((type) => <option key={type.id} value={type.id}>{employeeCopy[type.nameKey as keyof typeof employeeCopy] ?? type.nameKey}</option>)}
                </select>
              </label>
              <label>Start date
                <input type="date" required value={form.start} onChange={(event) => setForm({ ...form, start: event.target.value })} />
              </label>
              <label>End date
                <input type="date" required min={form.start || undefined} value={form.end} onChange={(event) => setForm({ ...form, end: event.target.value })} />
              </label>
              <div className="leave-half-day-grid">
                <label>First day
                  <select value={form.fromHalf} onChange={(event) => setForm({ ...form, fromHalf: event.target.value as HalfDay })}>
                    <option value="full">Full day</option><option value="AM">Morning half</option><option value="PM">Afternoon half</option>
                  </select>
                </label>
                <label>Last day
                  <select value={form.toHalf} onChange={(event) => setForm({ ...form, toHalf: event.target.value as HalfDay })}>
                    <option value="full">Full day</option><option value="AM">Morning half</option><option value="PM">Afternoon half</option>
                  </select>
                </label>
              </div>
              <label>Backup colleague (optional)
                <select value={form.backupUserId} onChange={(event) => setForm({ ...form, backupUserId: event.target.value })}>
                  <option value="">No backup selected</option>
                  {employees.filter((employee) => String(employee.userId) !== form.employeeId).map((employee) => (
                    <option key={employee.userId} value={employee.userId}>{employeeFullName(employee)}</option>
                  ))}
                </select>
              </label>
              <label>Note (optional)
                <textarea rows={3} value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} />
              </label>
              {previewDuration > 0 && <p className="missing-fields">Calculated duration: {previewDuration} working days.</p>}
              <div className="leave-form-actions">
                <button type="button" className="button secondary" onClick={() => setFormOpen(false)}>Cancel</button>
                <button type="submit" className="button primary">Create request</button>
              </div>
            </form>
          </aside>
        </div>
      )}
    </div>
  )
}
