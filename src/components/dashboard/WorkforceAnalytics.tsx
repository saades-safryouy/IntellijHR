import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Employee, LeaveRequest, OffboardingRequest, OnboardingRequest } from '../../types/models'

const stageColors = ['#3b82f6', '#8b5cf6', '#14b8a6', '#f59e0b', '#10b981']
const leaveColors = {
  approved: '#10b981',
  pending: '#f59e0b',
  rejected: '#f43f5e',
  cancelled: '#94a3b8',
} as const

function monthSeries(employees: Employee[], months: number, language: string) {
  const now = new Date()
  const firstMonth = new Date(now.getFullYear(), now.getMonth() - months + 1, 1)
  const series = Array.from({ length: months }, (_, index) => {
    const date = new Date(firstMonth.getFullYear(), firstMonth.getMonth() + index, 1)
    return {
      date,
      label: new Intl.DateTimeFormat(language, { month: 'short' }).format(date),
      value: 0,
    }
  })

  for (const employee of employees) {
    const joined = new Date(`${employee.joined}T00:00:00`)
    const offset =
      (joined.getFullYear() - firstMonth.getFullYear()) * 12 +
      joined.getMonth() -
      firstMonth.getMonth()
    if (!Number.isNaN(joined.getTime()) && offset >= 0 && offset < months) {
      series[offset].value += 1
    }
  }
  return series
}

function AreaChart({ data, reducedMotion }: {
  data: ReturnType<typeof monthSeries>
  reducedMotion: boolean | null
}) {
  const width = 680
  const height = 220
  const left = 34
  const right = 12
  const top = 18
  const bottom = 34
  const maxValue = Math.max(1, ...data.map((item) => item.value))
  const plotWidth = width - left - right
  const plotHeight = height - top - bottom
  const points = data.map((item, index) => ({
    ...item,
    x: left + (data.length === 1 ? plotWidth / 2 : (index / (data.length - 1)) * plotWidth),
    y: top + plotHeight - (item.value / maxValue) * plotHeight,
  }))
  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')
  const areaPath = `${linePath} L ${points.at(-1)?.x ?? left} ${top + plotHeight} L ${points[0]?.x ?? left} ${top + plotHeight} Z`

  return (
    <svg className="analytics-area-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Employee join dates by month">
      <defs>
        <linearGradient id="workforce-area-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity=".34" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity=".01" />
        </linearGradient>
        <linearGradient id="workforce-line-fill" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((line) => {
        const y = top + (plotHeight / 3) * line
        return <line key={line} x1={left} x2={width - right} y1={y} y2={y} className="analytics-grid-line" />
      })}
      <path d={areaPath} fill="url(#workforce-area-fill)" />
      <motion.path
        d={linePath}
        fill="none"
        stroke="url(#workforce-line-fill)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reducedMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reducedMotion ? 0 : 0.8, ease: 'easeOut' }}
      />
      {points.map((point) => (
        <g key={point.date.toISOString()}>
          <circle cx={point.x} cy={point.y} r="8" className="analytics-point-glow" />
          <circle cx={point.x} cy={point.y} r="3.5" className="analytics-point">
            <title>{`${point.label}: ${point.value} joined`}</title>
          </circle>
          <text x={point.x} y={height - 8} textAnchor="middle" className="analytics-axis-label">{point.label}</text>
        </g>
      ))}
    </svg>
  )
}

export function WorkforceAnalytics({
  employees,
  leaveRequests,
  onboardingRequests,
  offboardingRequests,
  language,
}: {
  employees: Employee[]
  leaveRequests: LeaveRequest[]
  onboardingRequests: OnboardingRequest[]
  offboardingRequests: OffboardingRequest[]
  language: string
}) {
  const [range, setRange] = useState<6 | 12>(6)
  const [activeDepartment, setActiveDepartment] = useState<string | null>(null)
  const reducedMotion = useReducedMotion()
  const hires = useMemo(() => monthSeries(employees, range, language), [employees, range, language])
  const departments = useMemo(() => {
    const counts = new Map<string, number>()
    for (const employee of employees) {
      counts.set(employee.department, (counts.get(employee.department) ?? 0) + 1)
    }
    return [...counts].sort((a, b) => b[1] - a[1])
  }, [employees])
  const departmentTotal = departments.reduce((sum, [, count]) => sum + count, 0)
  const selectedDepartment = departments.find(([name]) => name === activeDepartment)
  const leaveStatuses = (['approved', 'pending', 'rejected', 'cancelled'] as const).map((status) => ({
    status,
    count: leaveRequests.filter((request) => request.status === status).length,
  }))
  const totalLeave = leaveStatuses.reduce((sum, item) => sum + item.count, 0)
  const circumference = 100
  const activeOnboarding = onboardingRequests.filter(
    (request) => request.stage !== 'Completed' && request.status !== 'Completed',
  )
  const averageProgress = activeOnboarding.length
    ? Math.round(activeOnboarding.reduce((sum, request) => sum + request.progress, 0) / activeOnboarding.length)
    : 0
  const activeOffboarding = offboardingRequests.filter((request) => request.status !== 'Completed')
  const offboardingProgress = activeOffboarding.length
    ? Math.round(activeOffboarding.reduce((sum, request) => sum + request.progress, 0) / activeOffboarding.length)
    : 0

  return (
    <section className="analytics-grid" aria-label="Workforce analytics">
      <article className="panel analytics-panel analytics-hires">
        <div className="analytics-heading">
          <div>
            <span className="analytics-eyebrow">WORKFORCE</span>
            <h2>Employee join dates</h2>
            <p>Recorded start dates in the selected period</p>
          </div>
          <div className="analytics-range" role="group" aria-label="Chart time range">
            {([6, 12] as const).map((months) => (
              <button
                key={months}
                type="button"
                className={range === months ? 'active' : ''}
                aria-pressed={range === months}
                onClick={() => setRange(months)}
              >
                {months}M
              </button>
            ))}
          </div>
        </div>
        {employees.length ? (
          <>
            <div className="analytics-chart-wrap">
              <AreaChart data={hires} reducedMotion={reducedMotion} />
            </div>
            <div className="analytics-chart-footer">
              <span><i className="analytics-legend-dot" /> Employees joined</span>
              <strong>{hires.reduce((sum, item) => sum + item.value, 0)} in period</strong>
            </div>
          </>
        ) : <div className="analytics-empty">No employee data available yet.</div>}
      </article>

      <article className="panel analytics-panel analytics-departments">
        <div className="analytics-heading">
          <div>
            <span className="analytics-eyebrow">DISTRIBUTION</span>
            <h2>Departments</h2>
            <p>Current employee records</p>
          </div>
        </div>
        {departmentTotal ? (
          <>
            <div className="department-chart">
              <svg viewBox="0 0 42 42" role="img" aria-label="Employee distribution by department">
                <circle cx="21" cy="21" r="15.915" className="department-donut-track" />
                {departments.map(([name, count], index) => {
                  const value = (count / departmentTotal) * circumference
                  const offset = departments
                    .slice(0, index)
                    .reduce((sum, [, priorCount]) => sum + (priorCount / departmentTotal) * circumference, 0)
                  return (
                    <circle
                      key={name}
                      cx="21"
                      cy="21"
                      r="15.915"
                      className={`department-donut-segment ${activeDepartment === name ? 'selected' : ''}`}
                      stroke={stageColors[index % stageColors.length]}
                      strokeDasharray={`${value} ${circumference - value}`}
                      strokeDashoffset={-offset}
                      onMouseEnter={() => setActiveDepartment(name)}
                      onMouseLeave={() => setActiveDepartment(null)}
                    >
                      <title>{`${name}: ${count} employees`}</title>
                    </circle>
                  )
                })}
                <text x="21" y="20" className="department-donut-value">{selectedDepartment?.[1] ?? departmentTotal}</text>
                <text x="21" y="25" className="department-donut-label">{selectedDepartment?.[0] ?? 'people'}</text>
              </svg>
            </div>
            <div className="analytics-legend department-legend">
              {departments.map(([name, count], index) => (
                <button
                  type="button"
                  key={name}
                  className={activeDepartment === name ? 'active' : ''}
                  onMouseEnter={() => setActiveDepartment(name)}
                  onMouseLeave={() => setActiveDepartment(null)}
                  onFocus={() => setActiveDepartment(name)}
                  onBlur={() => setActiveDepartment(null)}
                  aria-label={`${name}: ${count} employees`}
                >
                  <i style={{ background: stageColors[index % stageColors.length] }} />
                  <span>{name}</span>
                  <strong>{count}</strong>
                </button>
              ))}
            </div>
          </>
        ) : <div className="analytics-empty">No department data available yet.</div>}
      </article>

      <article className="panel analytics-panel analytics-leave">
        <div className="analytics-heading">
          <div>
            <span className="analytics-eyebrow">LEAVE</span>
            <h2>Request status</h2>
            <p>{totalLeave} recorded requests</p>
          </div>
        </div>
        {totalLeave ? (
          <div className="leave-analytics">
            <div className="leave-stack" role="img" aria-label={leaveStatuses.map(({ status, count }) => `${status}: ${count}`).join(', ')}>
              {leaveStatuses.filter((item) => item.count).map(({ status, count }) => (
                <span key={status} style={{ width: `${(count / totalLeave) * 100}%`, background: leaveColors[status] }}>
                  <title>{`${status}: ${count}`}</title>
                </span>
              ))}
            </div>
            <div className="analytics-legend leave-legend">
              {leaveStatuses.map(({ status, count }) => (
                <div key={status}>
                  <i style={{ background: leaveColors[status] }} />
                  <span>{status}</span>
                  <strong>{count}</strong>
                </div>
              ))}
            </div>
          </div>
        ) : <div className="analytics-empty">No leave requests recorded yet.</div>}
      </article>

      <article className="panel analytics-panel analytics-lifecycle">
        <div className="analytics-heading">
          <div>
            <span className="analytics-eyebrow">LIFECYCLE</span>
            <h2>Workflow progress</h2>
            <p>Progress from active requests</p>
          </div>
        </div>
        <div className="workflow-progress-list">
          {[
            { label: 'Onboarding', count: activeOnboarding.length, progress: averageProgress, color: '#3b82f6' },
            { label: 'Offboarding', count: activeOffboarding.length, progress: offboardingProgress, color: '#8b5cf6' },
          ].map((item) => (
            <div className="workflow-progress-item" key={item.label}>
              <div className="workflow-progress-meta">
                <span>{item.label}</span>
                <strong>{item.count} active · {item.progress}%</strong>
              </div>
              <div className="workflow-progress-track" role="progressbar" aria-label={`${item.label} progress`} aria-valuenow={item.progress} aria-valuemin={0} aria-valuemax={100}>
                <motion.span
                  style={{ background: item.color }}
                  initial={reducedMotion ? false : { width: 0 }}
                  animate={{ width: `${item.progress}%` }}
                  transition={{ duration: reducedMotion ? 0 : 0.7, ease: 'easeOut' }}
                />
              </div>
            </div>
          ))}
          {!onboardingRequests.length && !offboardingRequests.length && (
            <div className="analytics-empty">No workflow data available yet.</div>
          )}
        </div>
      </article>
    </section>
  )
}
