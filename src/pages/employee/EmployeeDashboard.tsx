import { useAuth } from '../../contexts/AuthContext'
import { PageHeader } from '../../components/common/PageHeader'
import { Calendar, Clock, AlertCircle, CheckCircle, Users, Briefcase } from 'lucide-react'

const mockLeaveData = { annualLeave: { used: 5, available: 20, total: 25 }, sickLeave: { used: 1, available: 10, total: 10 } }
const mockLeaveRequests = [ { id: 1, type: 'Annual Leave', from: '2026-09-20', to: '2026-09-22', status: 'Approved', days: 3 } ]

function StatusBadge({ status }: { status: string }) {
  const statusClass = status === 'Approved' ? 'approved' : 'pending'
  return <span className={`status-badge ${statusClass}`}>{status}</span>
}

function KPICard({ label, value, icon: Icon, color }: { label: string; value: any; icon: any; color: string }) {
  return (<div className="kpi-card"><div className={`kpi-icon ${color}`}><Icon size={20} /></div><div className="kpi-content"><span className="kpi-label">{label}</span><span className="kpi-value">{value}</span></div></div>)
}

export function EmployeeDashboard() {
  const { currentUser } = useAuth()
  if (!currentUser) return <div>Loading...</div>
  const totalLeave = mockLeaveData.annualLeave.available
  const joinedDate = currentUser.joined ? new Date(currentUser.joined as string).toLocaleDateString() : 'N/A'

  return (
    <div className="page employee-dashboard-page">
      <PageHeader eyebrow="Employee Portal" title={`Welcome, ${currentUser.firstName}!`} subtitle="Your employee dashboard" />
      <section className="dashboard-kpis">
        <KPICard label="Leave Available" value={totalLeave} icon={Calendar} color="mint" />
        <KPICard label="Leave Used" value={mockLeaveData.annualLeave.used} icon={Clock} color="orange" />
        <KPICard label="Pending" value="1" icon={AlertCircle} color="blue" />
        <KPICard label="Tasks" value="8/10" icon={CheckCircle} color="mint" />
      </section>
      <section className="employee-section">
        <div className="panel-title-wrapper"><h3>My Profile</h3></div>
        <div className="panel">
          <div className="profile-header"><div className="avatar-large">{currentUser.initials}</div><div className="profile-header-info"><h2>{currentUser.firstName} {currentUser.lastName}</h2><p className="job-title">{currentUser.jobTitle}</p></div></div>
          <div className="profile-grid">
            <div className="profile-item"><span className="profile-label">Employee ID</span><span className="profile-value">#{currentUser.id}</span></div>
            <div className="profile-item"><span className="profile-label">Email</span><span className="profile-value">{currentUser.email}</span></div>
            <div className="profile-item"><span className="profile-label">Manager</span><span className="profile-value">{currentUser.manager}</span></div>
            <div className="profile-item"><span className="profile-label">Department</span><span className="profile-value">{currentUser.department}</span></div>
            <div className="profile-item"><span className="profile-label">Location</span><span className="profile-value">{currentUser.location}</span></div>
            <div className="profile-item"><span className="profile-label">Date Joined</span><span className="profile-value">{joinedDate}</span></div>
          </div>
        </div>
      </section>
      <section className="employee-section">
        <div className="panel-title-wrapper"><h3>Leave Overview</h3></div>
        <div className="leave-overview-grid">
          <div className="panel leave-card"><h4>Annual Leave</h4><div className="leave-stats"><div className="leave-stat"><span className="label">Available</span><span className="value">{mockLeaveData.annualLeave.available}</span></div><div className="leave-stat"><span className="label">Used</span><span className="value">{mockLeaveData.annualLeave.used}</span></div></div><div className="progress-bar"><div className="progress-fill" style={{ width: `80%` }} /></div></div>
        </div>
      </section>
      <section className="employee-section">
        <div className="panel-title-wrapper"><h3>Recent Requests</h3></div>
        <div className="panel"><table className="data-table"><thead><tr><th>Type</th><th>From</th><th>To</th><th>Status</th></tr></thead><tbody>{mockLeaveRequests.map((r) => (<tr key={r.id}><td>{r.type}</td><td>{r.from}</td><td>{r.to}</td><td><StatusBadge status={r.status} /></td></tr>))}</tbody></table></div>
      </section>
      <section className="employee-section">
        <div className="panel-title-wrapper"><h3>Quick Actions</h3></div>
        <div className="quick-actions-grid"><button className="action-card"><Calendar size={24} /><span>Request Leave</span></button><button className="action-card"><Users size={24} /><span>View Colleagues</span></button><button className="action-card"><Briefcase size={24} /><span>Documents</span></button><button className="action-card"><Clock size={24} /><span>Timesheets</span></button></div>
      </section>
    </div>
  )
}
