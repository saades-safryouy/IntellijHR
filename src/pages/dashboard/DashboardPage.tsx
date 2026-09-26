import {
  ArrowRight,
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
import { KpiCard } from '../../components/dashboard/KpiCard'
import { Event } from '../../components/dashboard/Event'
import { Activity } from '../../components/dashboard/Activity'
import { PageHeader } from '../../components/common/PageHeader'
import { PanelTitle } from '../../components/common/PanelTitle'
import { departments } from '../../data/mock'
import { translations } from '../../contexts/I18nContext'
import { useI18n } from '../../contexts/I18nContext'

export function DashboardPage() {
  const { language } = useI18n()
  const t = translations[language]

  return (
    <div className="page dashboard-page">
      <PageHeader
        eyebrow="MONDAY, 08 SEPTEMBER 2026"
        title="Good morning, Saad"
        subtitle="Here is what is happening across IntillegenceHR today."
      >
        <button className="button secondary">
          <FileText size={16} />
          {t.export}
        </button>

        <button className="button primary">
          <Plus size={16} />
          {t.create}
        </button>
      </PageHeader>

      <section className="kpi-grid">
        <KpiCard
          label={t.employees}
          value="248"
          trend="+4.2%"
          note="vs last month"
          icon={<Users size={18} />}
        />

        <KpiCard
          label={t.activeOnboarding}
          value="12"
          trend="3"
          note="requiring attention"
          icon={<ClipboardCheck size={18} />}
          warning
        />

        <KpiCard
          label={t.activeOffboarding}
          value="5"
          trend="2"
          note="overdue"
          icon={<LogOut size={18} />}
          warning
        />

        <KpiCard
          label={t.onLeave}
          value="18"
          trend="This week"
          note="across 5 departments"
          icon={<CalendarDays size={18} />}
        />

        <KpiCard
          label="Profile completion"
          value="91%"
          trend="+5%"
          note="vs last quarter"
          icon={<CheckCircle2 size={18} />}
        />
      </section>

      <div className="dashboard-grid">
        <section className="panel workforce-panel">
          <PanelTitle
            title="Workforce overview"
            subtitle="Headcount by department"
            action="Last 6 months"
          />

          <div className="chart-area">
            <div className="y-axis">
              <span>80</span>
              <span>60</span>
              <span>40</span>
              <span>20</span>
              <span>0</span>
            </div>

            <div className="bar-chart">
              {departments.map((department, index) => (
                <div className="bar-group" key={department.id}>
                  <div className="bars">
                    <div
                      className="bar previous"
                      style={{ height: `${40 + index * 7}px` }}
                    />
                    <div
                      className="bar current"
                      style={{ height: `${58 + index * 8}px` }}
                    />
                  </div>
                  <span>{department.name.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-legend">
            <span>
              <i className="legend-dot blue" />
              Current
            </span>
            <span>
              <i className="legend-dot muted" />
              Previous period
            </span>
            <strong>
              <ArrowRight size={14} />
              8.4% headcount growth
            </strong>
          </div>
        </section>

        <section className="panel pulse-panel">
          <PanelTitle
            title="HR pulse"
            subtitle="September 2026"
            action="View reports"
          />

          <div className="pulse-ring">
            <div>
              <strong>91%</strong>
              <span>Profile completion</span>
            </div>
          </div>

          <div className="pulse-stats">
            <span>
              <i className="legend-dot blue" />
              226 complete
            </span>
            <span>
              <i className="legend-dot orange" />
              22 need attention
            </span>
          </div>
        </section>

        <section className="panel workflow-panel">
          <PanelTitle
            title="Onboarding workflow"
            subtitle="12 active requests"
            action="View all"
          />

          <div className="workflow-list">
            {[
              'Created',
              'HR Validation',
              'Manager',
              'Local IT',
              'ISD',
              'Completed',
            ].map((stage, index) => (
              <div className="workflow-step" key={stage}>
                <div
                  className={`step-icon ${
                    index < 3 ? 'done' : index === 3 ? 'current' : ''
                  }`}
                >
                  {index < 3 ? (
                    <CheckCircle2 size={15} />
                  ) : index === 3 ? (
                    <Clock3 size={15} />
                  ) : (
                    index + 1
                  )}
                </div>
                <span>{stage}</span>
                <strong>{[12, 10, 8, 6, 4, 2][index]}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="panel events-panel">
          <PanelTitle
            title={t.upcoming}
            subtitle="Your schedule"
            action="Open calendar"
          />

          <Event
            date="Today"
            time="09:00"
            title="HR leadership sync"
            detail="Atlas meeting room"
            color="blue"
          />
          <Event
            date="Tomorrow"
            time="10:00"
            title="Ahmed Benali · Onboarding"
            detail="ISD technical setup"
            color="mint"
          />
          <Event
            date="Friday"
            time="All day"
            title="Sara El Idrissi · Annual leave"
            detail="4 working days"
            color="orange"
          />
        </section>

        <section className="panel activity-panel">
          <PanelTitle
            title={t.recent}
            subtitle="Across your workspace"
            action="View audit log"
          />

          <Activity
            icon={<Users size={15} />}
            title="New employee profile created"
            detail="Yassine Fathi · Finance"
            time="18 min ago"
          />
          <Activity
            icon={<CheckCircle2 size={15} />}
            title="Leave request approved"
            detail="Sara El Idrissi · Annual leave"
            time="1 hour ago"
          />
          <Activity
            icon={<Laptop size={15} />}
            title="Equipment marked as returned"
            detail="OFF-2026-0006 · MacBook Pro"
            time="Yesterday"
          />
        </section>
      </div>
    </div>
  )
}
