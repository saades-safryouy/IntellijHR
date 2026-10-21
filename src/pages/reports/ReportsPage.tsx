import { useState } from 'react'
import { FileText } from 'lucide-react'
import { PageHeader } from '../../components/common/PageHeader'
import { PanelTitle } from '../../components/common/PanelTitle'
import { getEmployees, getLeaveRequests } from '../../data/employeeStore'
import { useEmployeeStore } from '../../hooks/useEmployeeStore'
import { downloadFile, generateCsv } from '../../components/dashboard/DashboardUtils'

const monthFormatter = new Intl.DateTimeFormat(undefined, { month: 'short' })

function monthBuckets(monthCount: number) {
  const now = new Date()
  return Array.from({ length: monthCount }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - monthCount + index + 1, 1)
    return {
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      label: monthFormatter.format(date),
    }
  })
}

export function ReportsPage() {
  useEmployeeStore()
  const [period, setPeriod] = useState(6)
  const employees = getEmployees()
  const leaveRequests = getLeaveRequests()
  const buckets = monthBuckets(period)

  const joinsByMonth = buckets.map(({ key, label }) => ({
    label,
    value: employees.filter((employee) => employee.joined?.startsWith(key)).length,
  }))
  const leaveByMonth = buckets.map(({ key, label }) => ({
    label,
    value: leaveRequests.filter((request) => request.submittedAt?.startsWith(key)).length,
  }))
  const departments = employees.reduce<Record<string, number>>((counts, employee) => {
    counts[employee.department] = (counts[employee.department] ?? 0) + 1
    return counts
  }, {})
  const departmentEntries = Object.entries(departments).sort((a, b) => b[1] - a[1])
  const colors = ['blue', 'mint', 'orange', 'purple', 'rose', 'slate']
  const chartColors = ['#3f8df5', '#38c7a3', '#f5ae45', '#7d86c9', '#ef7185', '#718096']
  const departmentGradient = departmentEntries.reduce<{ stops: string[]; end: number }>(
    (gradient, [, count], index) => {
      const end = gradient.end + (count / employees.length) * 100
      gradient.stops.push(`${chartColors[index % chartColors.length]} ${gradient.end}% ${end}%`)
      return { stops: gradient.stops, end }
    },
    { stops: [], end: 0 },
  ).stops.join(', ')

  const exportReport = () => {
    const rows = [
      ['Employee joins', ...joinsByMonth.map(({ value }) => value)],
      ['Leave requests submitted', ...leaveByMonth.map(({ value }) => value)],
    ]
    const departmentRows = departmentEntries.map(([department, count]) => [department, count])
    const csv = [
      generateCsv(['Metric', ...buckets.map(({ label }) => label)], rows),
      '',
      generateCsv(['Department', 'Employees'], departmentRows),
    ].join('\n')
    downloadFile(csv, 'hr-workforce-report.csv')
  }

  const renderBars = (values: Array<{ label: string; value: number }>, emptyLabel: string) => {
    const max = Math.max(...values.map(({ value }) => value), 0)
    if (!max) return <div className="report-empty">{emptyLabel}</div>
    return (
      <div className="report-bars" role="img" aria-label={values.map(({ label, value }) => `${label}: ${value}`).join(', ')}>
        {values.map(({ label, value }) => (
          <div className="report-bar-column" key={label} title={`${label}: ${value}`}>
            <i style={{ height: `${Math.max((value / max) * 100, 3)}%` }} />
            <small>{label}</small>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="page">
      <PageHeader
        eyebrow="PEOPLE ANALYTICS"
        title="Reports"
        subtitle="Explore workforce activity based on your saved HR data."
      >
        <label className="report-period-control">
          <span>Period</span>
          <select value={period} onChange={(event) => setPeriod(Number(event.target.value))}>
            <option value={6}>Last 6 months</option>
            <option value={12}>Last 12 months</option>
          </select>
        </label>
        <button type="button" className="button primary" onClick={exportReport}>
          <FileText size={16} />
          Export report
        </button>
      </PageHeader>

      <div className="report-grid">
        <section className="panel report-card wide">
          <PanelTitle title="Employee joins" subtitle={`Saved join dates · last ${period} months`} action="" />
          {renderBars(joinsByMonth, 'No employee join dates in this period.')}
        </section>

        <section className="panel report-card">
          <PanelTitle title="Department mix" subtitle={`${employees.length} employees`} action="" />
          {departmentEntries.length ? (
            <>
              <div
                className="donut-chart report-donut"
                role="img"
                aria-label={`${employees.length} employees across ${departmentEntries.length} departments`}
                style={{ background: `radial-gradient(circle,var(--surface) 57%,transparent 58%),conic-gradient(${departmentGradient})` }}
              >
                <strong>
                  {employees.length}
                  <small>people</small>
                </strong>
              </div>
              <div className="report-legend">
                {departmentEntries.map(([department, count], index) => (
                  <span key={department}>
                    <i className={`legend-dot ${colors[index % colors.length]}`} />
                    {department} · {count}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="report-empty">No employee data available.</div>
          )}
        </section>

        <section className="panel report-card wide">
          <PanelTitle title="Leave requests" subtitle={`Requests submitted · last ${period} months`} action="" />
          {renderBars(leaveByMonth, 'No leave requests submitted in this period.')}
        </section>
      </div>
    </div>
  )
}
