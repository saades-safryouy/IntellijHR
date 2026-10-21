import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import {
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  Laptop,
  LogOut,
  Plus,
  Users,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { KpiCard } from '../../components/dashboard/KpiCard'
import { Event } from '../../components/dashboard/Event'
import { Activity } from '../../components/dashboard/Activity'
import { PageHeader } from '../../components/common/PageHeader'
import { PanelTitle } from '../../components/common/PanelTitle'
import { Breadcrumb } from '../../components/common/Breadcrumb'
import {
  calculateDashboardMetrics,
  generateExportCsv,
  downloadFile,
} from '../../components/dashboard/DashboardUtils'
import {
  getEmployees,
  getHolidays,
  getLeaveRequests,
  getOffboardingTasks,
  getOnboardingRequests,
} from '../../data/employeeStore'
import { translations } from '../../contexts/I18nContext'
import { useI18n } from '../../contexts/I18nContext'
import { useEmployeeStore } from '../../hooks/useEmployeeStore'
import { calculateProfileCompletion } from '../../utils/profileCompletion'
import { formatDate, formatDateTime } from '../../utils/dates'
import { WorkforceAnalytics } from '../../components/dashboard/WorkforceAnalytics'
import type { OnboardingStage } from '../../types/models'

export function DashboardPage() {
  useEmployeeStore()
  const { language } = useI18n()
  const navigate = useNavigate()
  const t = translations[language]
  const [isExporting, setIsExporting] = useState(false)

  const employees = getEmployees()
  const onboardingRequests = getOnboardingRequests()
  const offboardingRequests = getOffboardingTasks()
  const leaveRequests = getLeaveRequests()
  const holidays = getHolidays()

  const metrics = useMemo(
    () =>
      calculateDashboardMetrics(employees, onboardingRequests, leaveRequests, offboardingRequests),
    [employees, onboardingRequests, leaveRequests, offboardingRequests]
  )
  const profileMetrics = useMemo(() => {
    if (!employees.length) return { average: 0, complete: 0, incomplete: 0 }
    const completedCount = employees.filter(
      (employee) => calculateProfileCompletion(employee).percentage === 100,
    ).length
    return {
      average: Math.round(
        employees.reduce((sum, employee) => sum + calculateProfileCompletion(employee).percentage, 0) /
          employees.length,
      ),
      complete: completedCount,
      incomplete: employees.length - completedCount,
    }
  }, [employees])
  const upcomingHolidays = useMemo(
    () =>
      holidays
        .filter((holiday) => holiday.date >= new Date().toISOString().slice(0, 10))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 3),
    [holidays],
  )
  const recentLeaveRequests = useMemo(
    () => [...leaveRequests].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)).slice(0, 3),
    [leaveRequests],
  )

  // Get today's date
  const today = useMemo(() => {
    const date = new Date()
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).toUpperCase()
  }, [])

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const csv = generateExportCsv(employees)
      downloadFile(csv, `employees-export-${Date.now()}.csv`, 'text/csv')
    } finally {
      setIsExporting(false)
    }
  }

  const handleCreateRequest = () => {
    navigate('/app/leave')
  }

  return (
    <div className="page dashboard-page">
      <Breadcrumb
        items={[
          { label: t.dashboard },
        ]}
      />

      <PageHeader
        eyebrow={today}
        title="HR workspace overview"
        subtitle="Here is what is happening across IntillegenceHR today."
      >
        <button
          className="button secondary"
          onClick={handleExport}
          disabled={isExporting}
        >
          <FileText size={16} />
          {isExporting ? 'Exporting...' : t.export}
        </button>

        <button className="button primary" onClick={handleCreateRequest}>
          <Plus size={16} />
          {t.create}
        </button>
      </PageHeader>

      <section className="kpi-grid">
        <KpiCard
          label={t.employees}
          value={metrics.totalEmployees.toString()}
          trend={`${metrics.activeEmployees} active`}
          note="employee records"
          icon={<Users size={18} />}
        />

        <KpiCard
          label={t.activeOnboarding}
          value={metrics.activeOnboarding.toString()}
          trend={metrics.onboardingAtRisk.toString()}
          note="requiring attention"
          icon={<ClipboardCheck size={18} />}
          warning={metrics.onboardingAtRisk > 0}
        />

        <KpiCard
          label={t.activeOffboarding}
          value={metrics.activeOffboarding.toString()}
          trend={metrics.offboardingOverdue.toString()}
          note="overdue workflows"
          icon={<LogOut size={18} />}
          warning={metrics.offboardingOverdue > 0}
        />

        <KpiCard
          label={t.onLeave}
          value={metrics.onLeaveCount.toString()}
          trend={`${metrics.leavePending}`}
          note="pending approvals"
          icon={<CalendarDays size={18} />}
        />

        <KpiCard
          label="Active employees"
          value={`${metrics.totalEmployees ? Math.round((metrics.activeEmployees / metrics.totalEmployees) * 100) : 0}%`}
          trend={metrics.activeEmployees.toString()}
          note="of total workforce"
          icon={<Laptop size={18} />}
        />
      </section>

      <div className="dashboard-grid">
        <WorkforceAnalytics
          employees={employees}
          leaveRequests={leaveRequests}
          onboardingRequests={onboardingRequests}
          offboardingRequests={offboardingRequests}
          language={language}
        />

        <section className="panel pulse-panel">
          <PanelTitle
            title="HR pulse"
            subtitle="Employee profile completeness"
            action={`${employees.length} records`}
          />

          <div className="pulse-ring" style={{ '--profile-completion': `${profileMetrics.average}%` } as CSSProperties}>
            <div>
              <strong>{profileMetrics.average}%</strong>
              <span>Average completion</span>
            </div>
          </div>

          <div className="pulse-stats">
            <span><i className="legend-dot blue" />{profileMetrics.complete} complete</span>
            <span><i className="legend-dot orange" />{profileMetrics.incomplete} need attention</span>
          </div>
        </section>

        <section className="panel workflow-panel">
          <PanelTitle
            title="Onboarding workflow"
            subtitle={`${metrics.activeOnboarding} active requests`}
            action="View all"
            onAction={() => navigate('/app/onboarding/requests')}
          />

          <div className="workflow-list">
            {([
              'HR Validation',
              'Manager Approval',
              'Local IT',
              'ISD',
              'Completed',
            ] as OnboardingStage[]).map((stage, index) => {
              const stageCount = onboardingRequests.filter((request) => request.stage === stage).length
              return (
              <div className="workflow-step" key={stage}>
                <div
                  className={`step-icon ${stage === 'Completed' ? 'done' : stageCount ? 'current' : ''}`}
                >
                  {stage === 'Completed' ? (
                    <CheckCircle2 size={15} />
                  ) : stageCount ? (
                    <Clock3 size={15} />
                  ) : (
                    index + 1
                  )}
                </div>
                <span>{stage}</span>
                <strong>{stageCount}</strong>
              </div>
              )
            })}
          </div>
        </section>

        <section className="panel events-panel">
          <PanelTitle
            title="Upcoming holidays"
            subtitle="From the organization calendar"
            action="Open calendar"
            onAction={() => navigate('/app/calendar')}
          />
          {upcomingHolidays.length ? upcomingHolidays.map((holiday) => (
            <Event
              key={holiday.id}
              date={formatDate(holiday.date, language)}
              time="All day"
              title={holiday.name}
              detail={holiday.site ?? holiday.country ?? holiday.type}
              color={holiday.type === 'Public' ? 'blue' : 'mint'}
            />
          )) : <div className="analytics-empty">No upcoming holidays on the calendar.</div>}
        </section>

        <section className="panel activity-panel">
          <PanelTitle
            title="Recent leave requests"
            subtitle="Sorted by submission time"
            action="View requests"
            onAction={() => navigate('/app/leave/requests')}
          />
          {recentLeaveRequests.length ? recentLeaveRequests.map((request) => (
            <Activity
              key={request.id}
              icon={<CalendarDays size={15} />}
              title={`${request.employee} · ${request.type}`}
              detail={`${request.start} – ${request.end} · ${request.status}`}
              time={formatDateTime(request.submittedAt, language)}
            />
          )) : <div className="analytics-empty">No leave requests have been submitted.</div>}
        </section>
      </div>
    </div>
  )
}
