import { FolderOpen } from 'lucide-react'
import { PageHeader } from '../../components/common/PageHeader'
import { StatusBadge } from '../../components/employees/StatusBadge'

export function DocumentsPage() {
  return (
    <div className="page">
      <PageHeader
        eyebrow="PEOPLE RECORDS"
        title="Employee documents"
        subtitle="Keep contracts, identity documents and certifications current."
      >
        <button className="button secondary">
          <FolderOpen size={16} />
          Document types
        </button>
      </PageHeader>

      <section className="panel document-panel">
        <div className="document-summary">
          <div>
            <span>Total documents</span>
            <strong>684</strong>
          </div>
          <div>
            <span>Expiring soon</span>
            <strong className="orange-text">12</strong>
          </div>
          <div>
            <span>Missing</span>
            <strong className="red-text">8</strong>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Document</th>
                <th>Employee</th>
                <th>Type</th>
                <th>Uploaded</th>
                <th>Expiry</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  'Passport · Ahmed Benali',
                  'Ahmed Benali',
                  'Identity document',
                  '12 Mar 2025',
                  '12 Oct 2026',
                  'Expiring soon',
                ],
                [
                  'Employment contract · Sara El Idrissi',
                  'Sara El Idrissi',
                  'Contract',
                  '03 Jun 2023',
                  '03 Jun 2027',
                  'Valid',
                ],
                [
                  'Cloud certification · Othmane Berrada',
                  'Othmane Berrada',
                  'Certification',
                  '06 Sep 2025',
                  '06 Sep 2026',
                  'Expired',
                ],
              ].map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, index) => (
                    <td key={cell}>
                      {index === 5 ? <StatusBadge status={cell} /> : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
