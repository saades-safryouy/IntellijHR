import { useMemo, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useI18n } from '../../contexts/I18nContext'
import { PageHeader } from '../../components/common/PageHeader'
import { resolveEmployee, updateEmployeeProfile } from '../../data/employeeStore'
import { calculateProfileCompletion } from '../../utils/profileCompletion'
import { formatDate } from '../../utils/dates'
import { employeeDashboardTranslations } from './translations'
import { ProfileCard, ProgressBar } from './components'
import type { MaritalStatus } from '../../types/models'
import { useEmployeeStore } from '../../hooks/useEmployeeStore'

const MARITAL: MaritalStatus[] = ['Single', 'Married', 'Divorced', 'Widowed']

export function EmployeeProfilePage() {
  useEmployeeStore()
  const { currentUser } = useAuth()
  const { language } = useI18n()
  const t = employeeDashboardTranslations[language]
  const [params] = useSearchParams()
  const startEditing = params.get('edit') === '1'
  const [employee, setEmployee] = useState(() => resolveEmployee(currentUser))
  const [editing, setEditing] = useState(startEditing)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  if (!employee) {
    return (
      <div className="page">
        <div className="empty-block">{t.notFound}</div>
      </div>
    )
  }

  const { percentage, missing } = calculateProfileCompletion(employee)

  const onSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    const data = new FormData(event.currentTarget)
    const personalPhone = String(data.get('personalPhone') || '').trim()
    const professionalPhone = String(data.get('professionalPhone') || '').trim()
    const maritalStatus = String(data.get('maritalStatus') || employee.maritalStatus) as MaritalStatus
    const numberOfChildren = Number(data.get('numberOfChildren') ?? employee.numberOfChildren)
    const emergencyContactName = String(data.get('emergencyContactName') || '').trim()
    const emergencyContactPhone = String(data.get('emergencyContactPhone') || '').trim()
    const emergencyContactRelationship = String(data.get('emergencyContactRelationship') || '').trim()

    if (!personalPhone || !professionalPhone) {
      setError(t.completeYourProfile)
      return
    }
    if (Number.isNaN(numberOfChildren) || numberOfChildren < 0) {
      setError(t.completeYourProfile)
      return
    }

    setSaving(true)
    const next = {
      personalPhone,
      professionalPhone,
      maritalStatus,
      numberOfChildren,
      emergencyContactName: emergencyContactName || null,
      emergencyContactPhone: emergencyContactPhone || null,
      emergencyContactRelationship: emergencyContactRelationship || null,
    }
    const completed =
      personalPhone &&
      professionalPhone &&
      maritalStatus &&
      numberOfChildren >= 0 &&
      emergencyContactName &&
      emergencyContactPhone &&
      emergencyContactRelationship
        ? new Date().toISOString()
        : employee.personalInfoCompletedAt

    const updated = updateEmployeeProfile(employee.userId, {
      ...next,
      personalInfoCompletedAt: completed,
    })
    setSaving(false)
    if (updated) {
      setEmployee(updated)
      setEditing(false)
      setSaved(true)
    }
  }

  return (
    <div className="page employee-page">
      <PageHeader eyebrow={t.employeePortal} title={t.profileTitle} subtitle={t.profileSubtitle}>
        <Link to="/employee/dashboard" className="button secondary">
          {t.navDashboard}
        </Link>
        {!editing && (
          <button className="button primary" onClick={() => { setEditing(true); setSaved(false) }}>
            {t.editProfile}
          </button>
        )}
      </PageHeader>

      {saved && <div className="toast-inline">{t.savedSuccess}</div>}
      {error && <div className="toast-inline toast-error">{error}</div>}

      <section className="panel profile-meter-panel">
        <div className="panel-title">
          <div>
            <h2>{t.profileCompletion}</h2>
            <span>{percentage === 100 ? t.profileComplete : t.completeYourProfile}</span>
          </div>
          <strong>{percentage}%</strong>
        </div>
        <ProgressBar percentage={percentage} tone={percentage === 100 ? 'mint' : 'orange'} label={`${percentage}%`} />
        {missing.length > 0 && (
          <p className="missing-fields">
            {missing.map((field) => t[field as keyof typeof t] || field).join(' · ')}
          </p>
        )}
        {employee.personalInfoCompletedAt && percentage === 100 && (
          <p className="missing-fields">
            {t.completedOn} {formatDate(employee.personalInfoCompletedAt, language)}
          </p>
        )}
      </section>

      {editing ? (
        <section className="panel">
          <form className="leave-form profile-form" onSubmit={onSave}>
            <h4>{t.contact}</h4>
            <label>
              {t.personalPhone}
              <input name="personalPhone" defaultValue={employee.personalPhone} required />
            </label>
            <label>
              {t.professionalPhone}
              <input name="professionalPhone" defaultValue={employee.professionalPhone} required />
            </label>
            <label>
              {t.email}
              <input value={employee.email} disabled readOnly />
            </label>

            <h4>{t.family}</h4>
            <label>
              {t.maritalStatus}
              <select name="maritalStatus" defaultValue={employee.maritalStatus}>
                {MARITAL.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t.numberOfChildren}
              <input name="numberOfChildren" type="number" min={0} defaultValue={employee.numberOfChildren} required />
            </label>
            <label>
              {t.emergencyContactName}
              <input name="emergencyContactName" defaultValue={employee.emergencyContactName ?? ''} />
            </label>
            <label>
              {t.emergencyContactPhone}
              <input name="emergencyContactPhone" defaultValue={employee.emergencyContactPhone ?? ''} />
            </label>
            <label>
              {t.emergencyContactRelationship}
              <input name="emergencyContactRelationship" defaultValue={employee.emergencyContactRelationship ?? ''} />
            </label>

            <div className="leave-form-actions">
              <button type="button" className="button secondary" onClick={() => setEditing(false)}>
                {t.cancel}
              </button>
              <button type="submit" className="button primary" disabled={saving}>
                {saving ? t.saving : t.saveChanges}
              </button>
            </div>
          </form>
        </section>
      ) : (
        <section className="panel">
          <ProfileCard employee={employee} t={t} language={language} />
        </section>
      )}
    </div>
  )
}

void useMemo
