import { useMemo, useState } from 'react'
import { Plus, FileText, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/common/PageHeader'
import { Breadcrumb } from '../../components/common/Breadcrumb'
import { getOnboardingRequests } from '../../data/employeeStore'
import { translations } from '../../contexts/I18nContext'
import { useI18n } from '../../contexts/I18nContext'
import type { RequestStatus } from '../../types/models'

export function OnboardingPage() {
  const { language } = useI18n()
  const navigate = useNavigate()
  const t = translations[language]
  const [statusFilter, setStatusFilter] = useState<'all' | RequestStatus>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const requests = useMemo(() => getOnboardingRequests(), [])

  const filtered = useMemo(
    () =>
      statusFilter === 'all' ? requests : requests.filter((req) => req.status === statusFilter),
    [requests, statusFilter],
  )

  const stats = useMemo(
    () => ({
      total: requests.length,
      onTrack: requests.filter((r) => r.status === 'On track').length,
      atRisk: requests.filter((r) => r.status === 'At risk').length,
    }),
    [requests],
  )

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
        <button className="button secondary">
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
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="request-list">
          {filtered.map((req) => (
            <div
              key={req.id}
              className="request-item"
              onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
            >
              <div className="request-header">
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
              </div>

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
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
