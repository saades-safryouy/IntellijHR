import { useMemo, useState } from 'react'
import { Plus, FileText, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/common/PageHeader'
import { Breadcrumb } from '../../components/common/Breadcrumb'
import { offboardingRequests } from '../../data/mock'
import { translations } from '../../contexts/I18nContext'
import { useI18n } from '../../contexts/I18nContext'
import type { RequestStatus } from '../../types/models'

export function OffboardingPage() {
  const { language } = useI18n()
  const navigate = useNavigate()
  const t = translations[language]
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(
    () =>
      statusFilter === 'all'
        ? offboardingRequests
        : offboardingRequests.filter((req) => req.status === statusFilter),
    [statusFilter],
  )

  const stats = useMemo(
    () => ({
      total: offboardingRequests.length,
      onTrack: offboardingRequests.filter((req) => req.status === 'On track').length,
      atRisk: offboardingRequests.filter((req) => req.status === 'At risk').length,
      completed: offboardingRequests.filter((req) => req.status === 'Completed').length,
    }),
    [],
  )

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
        <button className="button secondary">
          <FileText size={16} />
          {t.export}
        </button>

        <button
          className="button primary"
          onClick={() => navigate('/app/offboarding/new')}
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
            <div
              key={request.id}
              className="request-item"
              onClick={() => setExpandedId(expandedId === request.id ? null : request.id)}
            >
              <div className="request-header">
                <div className="request-info">
                  <strong>{request.employee}</strong>
                  <small>Exit: {request.exitDate} · {request.reason}</small>
                </div>
                <div className="request-meta">
                  <span className="request-id">{request.id}</span>
                  <div
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(request.status) }}
                  >
                    {request.status}
                  </div>
                </div>
                <ChevronRight size={18} />
              </div>

              {expandedId === request.id && (
                <div className="request-details">
                  <div className="details-grid">
                    <div>
                      <span>Exit Date</span>
                      <strong>{request.exitDate}</strong>
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
                    <div
                      className="progress-fill"
                      style={{ width: `${request.progress}%` }}
                    />
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
