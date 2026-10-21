import { useState } from 'react'
import { Plus, FileText, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/common/PageHeader'
import { Breadcrumb } from '../../components/common/Breadcrumb'
import { getOnboardingRequests, updateOnboardingTask } from '../../data/employeeStore'
import { useEmployeeStore } from '../../hooks/useEmployeeStore'
import { downloadFile, generateCsv } from '../../components/dashboard/DashboardUtils'
import { translations } from '../../contexts/I18nContext'
import { useI18n } from '../../contexts/I18nContext'
import { employeeDashboardTranslations } from '../employee/translations'
import type { RequestStatus } from '../../types/models'

export function OnboardingPage() {
  useEmployeeStore()
  const { language } = useI18n()
  const navigate = useNavigate()
  const t = translations[language]
  const employeeCopy = employeeDashboardTranslations[language]
  const [statusFilter, setStatusFilter] = useState<'all' | RequestStatus>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const requests = getOnboardingRequests()

  const filtered =
    statusFilter === 'all' ? requests : requests.filter((req) => req.status === statusFilter)

  const exportRequests = () => {
    const csv = generateCsv(
      ['Employee', 'Position', 'Department', 'Start date', 'Stage', 'Assignee', 'Progress', 'Status'],
      requests.map((request) => [
        request.employee,
        request.position,
        request.department,
        request.startDate,
        request.stage,
        request.assignee,
        request.progress,
        request.status,
      ]),
    )
    downloadFile(csv, 'onboarding-requests.csv')
  }

  const toggleEmployeeTask = (requestId: string, taskId: string, done: boolean) => {
    const request = requests.find((item) => item.id === requestId)
    if (!request) return
    const employeeTasks = request.employeeTasks.map((task) =>
      task.id === taskId ? { ...task, done } : task,
    )
    const progress = employeeTasks.length
      ? Math.round((employeeTasks.filter((task) => task.done).length / employeeTasks.length) * 100)
      : request.progress
    const status = progress === 100 ? 'Completed' : request.status === 'Completed' ? 'On track' : request.status
    updateOnboardingTask(requestId, { employeeTasks, progress, status })
  }

  const stats = {
    total: requests.filter((r) => r.status !== 'Completed').length,
    onTrack: requests.filter((r) => r.status === 'On track').length,
    atRisk: requests.filter((r) => r.status === 'At risk').length,
    completed: requests.filter((r) => r.status === 'Completed').length,
  }

  const getStatusColor = (status: RequestStatus) => {
    const colors: Record<RequestStatus, string> = {
      'On track': '#10b981',
      'At risk': '#f59e0b',
      Overdue: '#ef4444',
      Completed: '#6b7280',
    }
    return colors[status] || '#e5e7eb'
  }

  return (
    <div className="page">
      <Breadcrumb items={[{ label: t.onboarding }]} />
      <PageHeader
        eyebrow={`ONBOARDING · ${stats.total} ACTIVE`}
        title={t.onboarding}
        subtitle="Track and manage employee onboarding workflows."
      >
        <button type="button" className="button secondary" onClick={exportRequests}>
          <FileText size={16} />
          {t.export}
        </button>
        <button className="button primary" onClick={() => navigate('/app/onboarding/new')}>
          <Plus size={16} />
          New Request
        </button>
      </PageHeader>

      <section className="stats-grid">
        <div className="stat-card">
          <span>Active</span>
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
          <h3>Onboarding Requests</h3>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | RequestStatus)}
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
          {filtered.map((req) => (
            <div
              key={req.id}
              className="request-item"
            >
              <button
                type="button"
                className="request-header request-header-button"
                aria-expanded={expandedId === req.id}
                onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
              >
                <div className="request-info">
                  <strong>{req.employee}</strong>
                  <small>{req.position} · {req.department}</small>
                </div>
                <div
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(req.status) }}
                >
                  {req.status}
                </div>
                <ChevronRight size={18} />
              </button>

              {expandedId === req.id && (
                <div className="request-details">
                  <div className="details-grid">
                    <div>
                      <span>Start Date</span>
                      <strong>{req.startDate}</strong>
                    </div>
                    <div>
                      <span>Stage</span>
                      <strong>{req.stage}</strong>
                    </div>
                    <div>
                      <span>Assignee</span>
                      <strong>{req.assignee}</strong>
                    </div>
                    <div>
                      <span>Progress</span>
                      <strong>{req.progress}%</strong>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${req.progress}%` }} />
                  </div>
                  {req.employeeTasks.length > 0 && (
                    <div className="workflow-task-list">
                      <h4>Employee checklist</h4>
                      {req.employeeTasks.map((task) => (
                        <label className="workflow-task" key={task.id}>
                          <input
                            type="checkbox"
                            checked={task.done}
                            onChange={(event) => toggleEmployeeTask(req.id, task.id, event.target.checked)}
                          />
                          <span>
                            {task.labelKey in employeeCopy
                              ? employeeCopy[task.labelKey as keyof typeof employeeCopy]
                              : task.labelKey}
                          </span>
                          {task.dueDate && <small>Due {task.dueDate}</small>}
                        </label>
                      ))}
                      {filtered.length === 0 && <div className="empty-state">No onboarding requests match this status.</div>}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
