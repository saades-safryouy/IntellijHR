import { useState, type FormEvent } from 'react'
import { Plus, FileText, ChevronRight } from 'lucide-react'
import { PageHeader } from '../../components/common/PageHeader'
import { Breadcrumb } from '../../components/common/Breadcrumb'
import { createOffboardingTask, getEmployees, getOffboardingTasks, updateOffboardingTask } from '../../data/employeeStore'
import { useEmployeeStore } from '../../hooks/useEmployeeStore'
import { downloadFile, generateCsv } from '../../components/dashboard/DashboardUtils'
import { translations } from '../../contexts/I18nContext'
import { useI18n } from '../../contexts/I18nContext'
import type { RequestStatus } from '../../types/models'
import { formatDate } from '../../utils/dates'

interface OffboardingDraft {
  stage: string
  progress: number
  status: RequestStatus
}

export function OffboardingPage() {
  useEmployeeStore()
  const { language } = useI18n()
  const t = translations[language]
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [createError, setCreateError] = useState('')
  const [draft, setDraft] = useState<OffboardingDraft | null>(null)
  const employees = getEmployees().filter((employee) => employee.status !== 'Terminated')

  const requests = getOffboardingTasks()
  const filtered =
    statusFilter === 'all' ? requests : requests.filter((req) => req.status === statusFilter)

  const stats = {
    total: requests.filter((req) => req.status !== 'Completed').length,
    onTrack: requests.filter((req) => req.status === 'On track').length,
    atRisk: requests.filter((req) => req.status === 'At risk').length,
    completed: requests.filter((req) => req.status === 'Completed').length,
  }

  const exportRequests = () => {
    const csv = generateCsv(
      ['Employee', 'Exit date', 'Reason', 'Replacement', 'Stage', 'Progress', 'Status'],
      requests.map((request) => [
        request.employee,
        request.exitDate,
        request.reason,
        request.replacement,
        request.stage,
        request.progress,
        request.status,
      ]),
    )
    downloadFile(csv, 'offboarding-requests.csv')
  }

  const saveProgress = (event: FormEvent<HTMLFormElement>, requestId: string) => {
    event.preventDefault()
    if (!draft || !draft.stage.trim() || draft.progress < 0 || draft.progress > 100) return
    const completed = draft.status === 'Completed' || draft.progress === 100
    updateOffboardingTask(requestId, {
      stage: draft.stage.trim(),
      progress: completed ? 100 : Math.round(draft.progress),
      status: completed ? 'Completed' : draft.status,
    })
    setDraft(null)
  }

  const createRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setCreateError('')
    const data = new FormData(event.currentTarget)
    const employee = employees.find((person) => String(person.userId) === String(data.get('employeeId')))
    const exitDate = String(data.get('exitDate') ?? '')
    const reason = String(data.get('reason') ?? '').trim()
    const replacement = String(data.get('replacement') ?? '').trim()
    if (!employee || !exitDate || !reason) {
      setCreateError('Select an employee, exit date, and reason.')
      return
    }
    createOffboardingTask({
      employee: `${employee.firstName} ${employee.lastName}`,
      exitDate,
      reason,
      replacement: replacement || 'To be confirmed',
      stage: 'Exit process started',
      progress: 0,
      status: 'On track',
    })
    setCreateOpen(false)
  }

  const getStatusColor = (status: RequestStatus): string => {
    switch (status) {
      case 'On track':
        return '#10b981'
      case 'At risk':
        return '#f59e0b'
      case 'Overdue':
        return '#ef4444'
      case 'Completed':
        return '#6b7280'
      default:
        return '#e5e7eb'
    }
  }

  return (
    <div className="page">
      <Breadcrumb
        items={[
          { label: t.offboarding },
        ]}
      />

      <PageHeader
        eyebrow={`OFFBOARDING · ${stats.total} ACTIVE`}
        title={t.offboarding}
        subtitle="Manage employee exit processes and knowledge transfer."
      >
        <button type="button" className="button secondary" onClick={exportRequests}>
          <FileText size={16} />
          {t.export}
        </button>

        <button
          type="button"
          className="button primary"
          onClick={() => {
            setCreateError('')
            setCreateOpen(true)
          }}
        >
          <Plus size={16} />
          New Request
        </button>
      </PageHeader>

      <section className="stats-grid">
        <div className="stat-card">
          <span>Total Active</span>
          <strong>{stats.total}</strong>
        </div>
        <div className="stat-card">
          <span>On Track</span>
          <strong className="success-text">{stats.onTrack}</strong>
        </div>
        <div className="stat-card">
          <span>At Risk</span>
          <strong className="warning-text">{stats.atRisk}</strong>
        </div>
        <div className="stat-card">
          <span>Completed</span>
          <strong>{stats.completed}</strong>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3>Offboarding Requests</h3>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as RequestStatus | 'all')}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="On track">On Track</option>
            <option value="At risk">At Risk</option>
            <option value="Overdue">Overdue</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="request-list">
          {filtered.map((request) => (
            <div className="request-item" key={request.id}>
              <button
                type="button"
                className="request-header request-header-button"
                aria-expanded={expandedId === request.id}
                onClick={() => {
                  const isExpanded = expandedId === request.id
                  setExpandedId(isExpanded ? null : request.id)
                  setDraft(isExpanded ? null : {
                    stage: request.stage,
                    progress: request.progress,
                    status: request.status,
                  })
                }}
              >
                <div className="request-info">
                  <strong>{request.employee}</strong>
                  <small>Exit: {formatDate(request.exitDate, language)} · {request.reason}</small>
                </div>
                <div className="request-meta">
                  <span className="request-id">{request.id}</span>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(request.status) }}
                  >
                    {request.status}
                  </span>
                </div>
                <ChevronRight size={18} />
              </button>

              {expandedId === request.id && (
                <div className="request-details">
                  <div className="details-grid">
                    <div>
                      <span>Exit Date</span>
                      <strong>{formatDate(request.exitDate, language)}</strong>
                    </div>
                    <div>
                      <span>Replacement</span>
                      <strong>{request.replacement}</strong>
                    </div>
                    <div>
                      <span>Current Stage</span>
                      <strong>{request.stage}</strong>
                    </div>
                    <div>
                      <span>Progress</span>
                      <strong>{request.progress}%</strong>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${request.progress}%` }} />
                  </div>
                  {draft && (
                    <form className="workflow-edit-form" onSubmit={(event) => saveProgress(event, request.id)}>
                      <label>Current stage
                        <input required value={draft.stage} onChange={(event) => setDraft({ ...draft, stage: event.target.value })} />
                      </label>
                      <label>Progress (%)
                        <input type="number" min="0" max="100" required value={draft.progress} onChange={(event) => setDraft({ ...draft, progress: Number(event.target.value) })} />
                      </label>
                      <label>Status
                        <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as RequestStatus })}>
                          <option value="On track">On Track</option>
                          <option value="At risk">At Risk</option>
                          <option value="Overdue">Overdue</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </label>
                      <button type="submit" className="button primary">Save workflow</button>
                    </form>
                  )}
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && <div className="empty-state">No offboarding requests match this status.</div>}
        </div>
      </section>
      {createOpen && (
        <div className="drawer-backdrop" onClick={() => setCreateOpen(false)}>
          <aside className="employee-drawer leave-drawer" role="dialog" aria-modal="true" aria-labelledby="offboarding-create-title" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-header">
              <span id="offboarding-create-title">Create offboarding request</span>
              <button type="button" className="icon-button" onClick={() => setCreateOpen(false)} aria-label="Close">×</button>
            </div>
            <form className="leave-form" onSubmit={createRequest}>
              {createError && <div className="toast-inline toast-error" role="alert">{createError}</div>}
              <label>Employee
                <select name="employeeId" required defaultValue="">
                  <option value="" disabled>Select an employee</option>
                  {employees.map((employee) => (
                    <option key={employee.userId} value={employee.userId}>{employee.firstName} {employee.lastName}</option>
                  ))}
                </select>
              </label>
              <label>Exit date
                <input type="date" name="exitDate" required />
              </label>
              <label>Reason
                <input name="reason" required maxLength={120} placeholder="Resignation, end of contract…" />
              </label>
              <label>Replacement
                <input name="replacement" maxLength={120} placeholder="To be confirmed" />
              </label>
              <div className="leave-form-actions">
                <button type="button" className="button secondary" onClick={() => setCreateOpen(false)}>Cancel</button>
                <button type="submit" className="button primary">Create request</button>
              </div>
            </form>
          </aside>
        </div>
      )}
    </div>
  )
}
