import { FileText } from 'lucide-react'
import { PageHeader } from './PageHeader'
import { PanelTitle } from './PanelTitle'
import { StatusBadge } from '../employees/StatusBadge'
import { downloadFile, generateCsv } from '../dashboard/DashboardUtils'

export function ModulePage({
  title,
  data,
}: {
  title: string
  data: unknown[]
}) {
  const exportData = () => {
    const records = data.filter(
      (item): item is Record<string, unknown> => typeof item === 'object' && item !== null,
    )
    const headers = [...new Set(records.flatMap((record) => Object.keys(record)))]
    const rows = records.map((record) =>
      headers.map((header) => {
        const value = record[header]
        return typeof value === 'string' || typeof value === 'number' ? value : JSON.stringify(value ?? '')
      }),
    )
    downloadFile(generateCsv(headers, rows), `${title.toLowerCase().replaceAll(' ', '-')}.csv`)
  }

  return (
    <div className="page">
      <PageHeader
        eyebrow="IntillegenceHR WORKSPACE"
        title={title}
        subtitle="Keep your people operations moving with clarity and control."
      >
        <button type="button" className="button secondary" disabled={!data.length} onClick={exportData}>
          <FileText size={16} />
          Export
        </button>
      </PageHeader>

      <section className="panel module-panel">
        <PanelTitle
          title="Work queue"
          subtitle="Updated just now"
          action="Configure columns"
        />

        <div className="module-list">
          {data.map((item, index) => {
            const record = item as Record<string, unknown>
            const name = String(
              record.employee || record.name || 'Annual leave balance',
            )
            const id = String(record.id || index)
            const progress =
              typeof record.progress === 'number' ? record.progress : undefined

            return (
              <div className="module-row" key={id}>
                <div className="row-leading">
                  <div className="avatar">
                    {name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div>
                    <strong>{name}</strong>
                    <span>
                      {String(
                        record.position ||
                          record.date ||
                          record.start ||
                          'Workflow record',
                      )}
                    </span>
                  </div>
                </div>

                <div className="row-meta">
                  {progress !== undefined ? (
                    <>
                      <div className="mini-progress">
                        <span style={{ width: `${progress}%` }} />
                      </div>
                      <small>{progress}%</small>
                    </>
                  ) : (
                    <StatusBadge status={String(record.status || 'Ready')} />
                  )}

                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
