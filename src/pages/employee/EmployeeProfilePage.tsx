import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useI18n } from '../../contexts/I18nContext'
import { PageHeader } from '../../components/common/PageHeader'
import { employees } from '../../data/mock'
import { calculateProfileCompletion, resolveEmployee } from '../../utils/employeeHelpers'
import { employeeDashboardTranslations } from './translations'
import { ProfileCard, ProgressBar } from './components'

export function EmployeeProfilePage() {
  const { currentUser } = useAuth()
  const { language } = useI18n()
  const t = employeeDashboardTranslations[language]
  const employee = resolveEmployee(currentUser, employees)

  if (!employee) {
    return (
      <div className="page">
        <div className="empty-block">{t.notFound}</div>
      </div>
    )
  }

  const { percentage, missing } = calculateProfileCompletion(employee)

  return (
    <div className="page employee-page">
      <PageHeader eyebrow={t.employeePortal} title={t.profileTitle} subtitle={t.profileSubtitle}>
        <Link to="/employee/dashboard" className="button secondary">
          {t.navDashboard}
        </Link>
        <button className="button primary">{t.editProfile}</button>
      </PageHeader>

      <section className="panel profile-meter-panel">
        <div className="panel-title">
          <div>
            <h2>{t.profileCompletion}</h2>
            <span>{percentage === 100 ? t.profileComplete : t.completeYourProfile}</span>
          </div>
          <strong>{percentage}%</strong>
        </div>
        <ProgressBar percentage={percentage} tone={percentage === 100 ? 'mint' : 'orange'} />
        {missing.length > 0 && (
          <p className="missing-fields">
            {missing.map((field) => t[field as keyof typeof t] || field).join(' · ')}
          </p>
        )}
      </section>

      <section className="panel">
        <ProfileCard employee={employee} t={t} language={language} />
      </section>
    </div>
  )
}
