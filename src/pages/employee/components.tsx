import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import type { Employee, EmployeeNotification } from '../../types/models'
import { employeeFullName, formatDate, nationalityKey } from '../../utils/employeeHelpers'
import type { EmployeeCopy } from './translations'
import { interpolate, leaveStatusLabel, notifTitleKey, statusCss } from './translations'

export function StatusBadge({
  status,
  label,
}: {
  status: string
  label?: string
}) {
  return <span className={`status-badge ${statusCss(status)}`}>{label ?? status}</span>
}

export function ProfileInfoItem({
  label,
  value,
}: {
  label: string
  value: string | number | null | undefined
}) {
  return (
    <div className="profile-item">
      <span className="profile-label">{label}</span>
      <span className="profile-value">{value || '—'}</span>
    </div>
  )
}

export function ProgressBar({
  percentage,
  tone = 'blue',
  label,
}: {
  percentage: number
  tone?: 'blue' | 'mint' | 'orange' | 'purple'
  label?: string
}) {
  const width = Math.max(0, Math.min(100, percentage))
  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-valuenow={width}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? `${width}%`}
    >
      <div className={`progress-fill ${tone}`} style={{ width: `${width}%` }} />
    </div>
  )
}

export function NotificationItem({
  notification,
  t,
  onDismiss,
  dismissLabel,
  language = 'en',
}: {
  notification: EmployeeNotification
  t: EmployeeCopy
  onDismiss: (id: string) => void
  dismissLabel: string
  language?: string
}) {
  const titleTemplate = t[notifTitleKey(notification.type)]
  const title = interpolate(titleTemplate, notification.params)
  const time = formatDate(notification.createdAt, language)
  const tone =
    notification.type.startsWith('passport') || notification.type === 'leave-rejected'
      ? 'warning'
      : notification.type === 'leave-approved'
        ? 'success'
        : 'info'

  return (
    <div className={`inbox-item ${tone} ${notification.read ? '' : 'unread'}`}>
      <div className={`inbox-dot ${tone}`} />
      <div className="inbox-copy">
        <strong>{title}</strong>
        {notification.params?.requestId && <span>{notification.params.requestId}</span>}
        <small>{time}</small>
      </div>
      <button className="icon-button" onClick={() => onDismiss(notification.id)} aria-label={dismissLabel}>
        <X size={15} />
      </button>
    </div>
  )
}

export function EmptyState({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="empty-block">
      <strong>{title}</strong>
      {detail ? <span>{detail}</span> : null}
    </div>
  )
}

export function SectionLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="text-button">
      {children}
    </Link>
  )
}

export function ProfileCard({
  employee,
  t,
  language = 'en',
}: {
  employee: Employee
  t: EmployeeCopy
  language?: string
}) {
  return (
    <div className="profile-sheet">
      <div className="profile-heading">
        <div className="avatar profile-avatar">{employee.initials}</div>
        <div>
          <h2>{employeeFullName(employee)}</h2>
          <p>{employee.jobTitle}</p>
          <StatusBadge status={employee.status === 'Active' ? 'approved' : 'pending'} label={employee.status} />
        </div>
      </div>

      <div className="profile-section">
        <h4>{t.identity}</h4>
        <div className="profile-grid">
          <ProfileInfoItem label={t.firstName} value={employee.firstName} />
          <ProfileInfoItem label={t.lastName} value={employee.lastName} />
          <ProfileInfoItem label={t.gender} value={employee.gender} />
          <ProfileInfoItem label={t.nationality} value={t[nationalityKey(employee.nationalityId) as keyof EmployeeCopy]} />
          <ProfileInfoItem label={t.nationalId} value={employee.nationalId} />
        </div>
      </div>

      <div className="profile-section">
        <h4>{t.contact}</h4>
        <div className="profile-grid">
          <ProfileInfoItem label={t.personalPhone} value={employee.personalPhone} />
          <ProfileInfoItem label={t.professionalPhone} value={employee.professionalPhone} />
          <ProfileInfoItem label={t.email} value={employee.email} />
        </div>
      </div>

      <div className="profile-section">
        <h4>{t.family}</h4>
        <div className="profile-grid">
          <ProfileInfoItem label={t.maritalStatus} value={employee.maritalStatus} />
          <ProfileInfoItem label={t.numberOfChildren} value={employee.numberOfChildren} />
          <ProfileInfoItem label={t.emergencyContactName} value={employee.emergencyContactName} />
          <ProfileInfoItem label={t.emergencyContactPhone} value={employee.emergencyContactPhone} />
          <ProfileInfoItem label={t.emergencyContactRelationship} value={employee.emergencyContactRelationship} />
        </div>
      </div>

      <div className="profile-section">
        <h4>{t.employment}</h4>
        <div className="profile-grid">
          <ProfileInfoItem label={t.jobTitle} value={employee.jobTitle} />
          <ProfileInfoItem label={t.department} value={employee.department} />
          <ProfileInfoItem label={t.location} value={employee.location} />
          <ProfileInfoItem label={t.employmentType} value={employee.employmentType} />
          <ProfileInfoItem label={t.manager} value={employee.manager} />
          <ProfileInfoItem label={t.joined} value={formatDate(employee.joined, language)} />
          <ProfileInfoItem label={t.status} value={employee.status} />
        </div>
      </div>

      <div className="profile-section">
        <h4>{t.documents}</h4>
        <div className="profile-grid">
          <ProfileInfoItem label={t.passportNumber} value={employee.passportNumber} />
          <ProfileInfoItem
            label={t.passportValidity}
            value={employee.passportValidityDate ? formatDate(employee.passportValidityDate, language) : '—'}
          />
        </div>
      </div>
    </div>
  )
}

export { leaveStatusLabel }
