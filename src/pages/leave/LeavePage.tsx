import { useMemo, useState } from 'react'
import { Plus, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/common/PageHeader'
import { Breadcrumb } from '../../components/common/Breadcrumb'
import { StatusBadge } from '../../components/employees/StatusBadge'
import { getLeaveRequests, approveLeaveRequest, rejectLeaveRequest } from '../../data/employeeStore'
import { leaveTypes } from '../../data/mock'
import { translations } from '../../contexts/I18nContext'
import { useI18n } from '../../contexts/I18nContext'
import type { LeaveStatus } from '../../types/models'

export function LeavePage() {
  const { language, text } = useI18n()
  const navigate = useNavigate()
  const t = translations[language]
  const [status, setStatus] = useState<LeaveStatus | 'all'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const leaveRequests = useMemo(() => getLeaveRequests(), [])

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
    approveLeaveRequest(requestId)
    setExpandedId(null)
  }

  const handleReject = (requestId: string) => {
    rejectLeaveRequest(requestId)
    setExpandedId(null)
  }

  const getLeaveTypeColor = (typeId: string): string => {
    const type = leaveTypes.find((lt) => lt.id === typeId)
    return type?.color || '#e5e7eb'
  }

  return (
    <div className="page">
      <Breadcrumb
        items={[
          { label: text('leave.label') },
        ]}
      />

      <PageHeader
        eyebrow={`LEAVE · ${stats.total} REQUESTS`}
        title={text('leave.label')}
        subtitle="Manage and track employee leave requests."
      >
        <button className="button secondary">
          <FileText size={16} />
          {t.export}
        </button>

        <button
          className="button primary"
          onClick={() => navigate('/app/leave/new')}
        >
          <Plus size={16} />
          {t.create}
        </button>
      </PageHeader>

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
                <div className="leave-info">
                  <div
                    className="leave-type-badge"
                    style={{ backgroundColor: getLeaveTypeColor(request.typeId) }}
                  >
                    {request.type.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <strong>{request.employee}</strong>
                    <small>{request.type} · {request.start} to {request.end} ({request.duration} days)</small>
                  </div>
                  <StatusBadge status={request.status as any} />
                </div>

                {request.status === 'pending' && (
                  <div className="leave-actions">
                    <button
                      className="button secondary"
                      onClick={() => handleReject(request.id)}
                    >
                      Reject
                    </button>
                    <button
                      className="button primary"
                      onClick={() => handleApprove(request.id)}
                    >
                      Approve
                    </button>
                  </div>
                )}

                {expandedId === request.id && (
                  <div className="leave-details">
                    <div>
                      <span>Backup:</span>
                      <strong>{request.backup}</strong>
                    </div>
                    {request.note && (
                      <div>
                        <span>Note:</span>
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
    </div>
  )
}

