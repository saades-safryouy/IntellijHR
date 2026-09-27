import { Download } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useI18n } from '../../contexts/I18nContext'
import { PageHeader } from '../../components/common/PageHeader'
import { employees } from '../../data/mock'
import { daysUntil, formatDate, resolveEmployee } from '../../utils/employeeHelpers'
import { employeeDashboardTranslations } from './translations'
import { StatusBadge } from './components'

export function EmployeeDocumentsPage() {
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

  const passportDays = employee.passportValidityDate ? daysUntil(employee.passportValidityDate) : null
  const documents = [
    {
      name: t.contract,
      type: t.employment,
      uploaded: employee.joined,
      expiry: '—',
      status: t.valid,
    },
    {
      name: t.identityDoc,
      type: t.identity,
      uploaded: employee.joined,
      expiry: '—',
      status: employee.nationalId ? t.valid : t.missing,
    },
    {
      name: t.passport,
      type: t.identity,
      uploaded: employee.joined,
      expiry: employee.passportValidityDate ? formatDate(employee.passportValidityDate, language) : '—',
      status:
        passportDays === null
          ? t.missing
          : passportDays < 0
            ? 'Expired'
            : passportDays <= 90
              ? t.expiringSoon
              : t.valid,
    },
    {
      name: t.lastPayslip,
      type: t.netPay,
      uploaded: '30 Sep 2026',
      expiry: '—',
      status: t.valid,
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
                  <td>{document.expiry}</td>
                  <td>
                    <StatusBadge status={document.status} />
                  </td>
                  <td>
                    <button className="button ghost">
                      <Download size={15} />
                      {t.download}
                    </button>
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
