import { useAuth } from '../../contexts/AuthContext'
import { useI18n } from '../../contexts/I18nContext'
import { PageHeader } from '../../components/common/PageHeader'
import { resolveEmployee } from '../../data/employeeStore'
import { daysUntil, formatDate } from '../../utils/dates'
import { passportAlertLevel } from '../../utils/passport'
import { employeeDashboardTranslations } from './translations'
import { StatusBadge } from './components'
import { useEmployeeStore } from '../../hooks/useEmployeeStore'

export function EmployeeDocumentsPage() {
  useEmployeeStore()
  const { currentUser } = useAuth()
  const { language } = useI18n()
  const t = employeeDashboardTranslations[language]
  const employee = resolveEmployee(currentUser)

  if (!employee) {
    return (
      <div className="page">
        <div className="empty-block">{t.notFound}</div>
      </div>
    )
  }

  const level = passportAlertLevel(employee.passportValidityDate)
  const passportStatus =
    !employee.passportValidityDate
      ? 'missing'
      : level === 'expired'
        ? 'expired'
        : level
          ? 'expiring soon'
          : 'valid'

  const documents = [
    {
      name: t.identityDoc,
      type: t.identity,
      uploaded: formatDate(employee.joined, language),
      expiry: '—',
      status: employee.nationalId ? 'valid' : 'missing',
      label: employee.nationalId ? t.valid : t.missing,
      available: false,
    },
    {
      name: t.passport,
      type: t.identity,
      uploaded: formatDate(employee.joined, language),
      expiry: employee.passportValidityDate ? formatDate(employee.passportValidityDate, language) : '—',
      status: passportStatus,
      label:
        passportStatus === 'missing'
          ? t.missing
          : passportStatus === 'expired'
            ? t.expired
            : passportStatus === 'expiring soon'
              ? t.expiringSoon
              : t.valid,
      available: false,
      extra:
        employee.passportValidityDate && level && level !== 'expired'
          ? `${daysUntil(employee.passportValidityDate)} ${t.daysAway}`
          : undefined,
    },
    {
      name: t.contract,
      type: t.employment,
      uploaded: formatDate(employee.joined, language),
      expiry: '—',
      status: 'valid',
      label: t.valid,
      available: false,
    },
  ]

  return (
    <div className="page employee-page">
      <PageHeader eyebrow={t.employeePortal} title={t.documentsTitle} subtitle={t.documentsSubtitle} />

      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t.documents}</th>
                <th>{t.type}</th>
                <th>{t.uploaded}</th>
                <th>{t.expiry}</th>
                <th>{t.status}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {documents.map((document) => (
                <tr key={document.name}>
                  <td>{document.name}</td>
                  <td>{document.type}</td>
                  <td>{document.uploaded}</td>
                  <td>
                    {document.expiry}
                    {document.extra ? ` · ${document.extra}` : ''}
                  </td>
                  <td>
                    <StatusBadge status={document.status} label={document.label} />
                  </td>
                  <td>
                    <span className="muted-note">{t.noFileAvailable}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
