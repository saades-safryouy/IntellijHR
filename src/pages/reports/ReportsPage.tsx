import { FileText, Globe2 } from 'lucide-react'
import { PageHeader } from '../../components/common/PageHeader'
import { PanelTitle } from '../../components/common/PanelTitle'

export function ReportsPage() {
  return (
    <div className="page">
      <PageHeader
        eyebrow="PEOPLE ANALYTICS"
        title="Reports"
        subtitle="Turn workforce data into a clear operating picture."
      >
        <button className="button secondary">
          <Globe2 size={16} />
          Filters
        </button>

        <button className="button primary">
          <FileText size={16} />
          Export report
        </button>
      </PageHeader>

      <div className="report-grid">
        <section className="panel report-card wide">
          <PanelTitle
            title="Headcount trend"
            subtitle="Last 6 months"
            action="View detail"
          />
          <div className="line-chart">
            {[32, 38, 35, 55, 62, 74, 80].map((height, index) => (
              <span style={{ height: `${height}%` }} key={index} />
            ))}
          </div>
        </section>

        <section className="panel report-card">
          <PanelTitle
            title="Department mix"
            subtitle="248 employees"
            action=""
          />
          <div className="donut-chart">
            <strong>
              248
              <small>people</small>
            </strong>
          </div>
          <div className="report-legend">
            <span>
              <i className="legend-dot blue" />
              Engineering · 64
            </span>
            <span>
              <i className="legend-dot mint" />
              Operations · 48
            </span>
            <span>
              <i className="legend-dot orange" />
              Commercial · 37
            </span>
          </div>
        </section>

        <section className="panel report-card wide">
          <PanelTitle
            title="Leave trends"
            subtitle="Requests by month"
            action="View detail"
          />
          <div className="report-bars">
            {[43, 62, 48, 75, 54, 68, 82, 59, 73].map((height, index) => (
              <i style={{ height: `${height}%` }} key={index} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
