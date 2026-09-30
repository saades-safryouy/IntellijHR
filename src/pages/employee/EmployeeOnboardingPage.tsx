import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useI18n } from '../../contexts/I18nContext'
import { PageHeader } from '../../components/common/PageHeader'
import { getMyOnboarding, isOnboardingTaskDone, resolveEmployee, toggleOnboardingTask } from '../../data/employeeStore'
import { ONBOARDING_STAGE_ORDER } from '../../types/models'
import { formatDate } from '../../utils/dates'
import { employeeDashboardTranslations } from './translations'
import { EmptyState, ProgressBar, StatusBadge } from './components'

export function EmployeeOnboardingPage() {
  const { currentUser } = useAuth()
  const { language } = useI18n()
  const t = employeeDashboardTranslations[language]
  const employee = resolveEmployee(currentUser)
  const [, tick] = useState(0)
  const request = employee ? getMyOnboarding(employee.userId) : undefined

  if (!employee) {
    return (
      <div className="page">
        <div className="empty-block">{t.notFound}</div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="page employee-page">
        <PageHeader eyebrow={t.employeePortal} title={t.onboardingTitle} subtitle={t.onboardingSubtitle} />
        <section className="panel">
          <EmptyState title={t.noOnboarding} />
        </section>
      </div>
    )
  }

  const visibleTasks = request.employeeTasks.filter((task) => task.employeeVisible)
  const currentIndex = ONBOARDING_STAGE_ORDER.indexOf(request.stage)

  return (
    <div className="page employee-page">
      <PageHeader eyebrow={t.employeePortal} title={t.onboardingTitle} subtitle={t.onboardingSubtitle} />

      <section className="kpi-grid employee-kpis">
        <article className="kpi-card">
          <span className="kpi-label">{t.progress}</span>
          <strong className="kpi-value">
            {request.progress}
            <small>%</small>
          </strong>
          <ProgressBar percentage={request.progress} tone="mint" label={`${request.progress}%`} />
        </article>
        <article className="kpi-card">
          <span className="kpi-label">{t.stage}</span>
          <strong className="kpi-value" style={{ fontSize: 18 }}>{request.stage}</strong>
          <div className="kpi-trend">{request.id}</div>
        </article>
      </section>

      <section className="panel">
        <div className="panel-title">
          <div>
            <h2>{t.stage}</h2>
          </div>
        </div>
        <ol className="onboarding-stages">
          {ONBOARDING_STAGE_ORDER.map((stage, index) => {
            const done = index < currentIndex || request.stage === 'Completed'
            const current = stage === request.stage
            return (
              <li key={stage} className={done ? 'done' : current ? 'current' : ''}>
                <StatusBadge
                  status={done ? 'approved' : current ? 'pending' : 'info'}
                  label={stage}
                />
              </li>
            )
          })}
        </ol>
      </section>

      <section className="panel">
        <div className="panel-title">
          <div>
            <h2>{t.tasks}</h2>
            <span>
              {visibleTasks.filter((task) => isOnboardingTaskDone(task.id, request)).length} / {visibleTasks.length}
            </span>
          </div>
        </div>
        <ul className="holiday-board">
          {visibleTasks.map((task) => {
            const done = isOnboardingTaskDone(task.id, request)
            const overdue = task.dueDate ? Date.parse(task.dueDate) < Date.now() && !done : false
            return (
              <li key={task.id}>
                <label className="task-row">
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={(event) => {
                      toggleOnboardingTask(task.id, event.target.checked)
                      tick((n) => n + 1)
                    }}
                  />
                  <div>
                    <strong>{t[task.labelKey as keyof typeof t] || task.labelKey}</strong>
                    {task.dueDate && (
                      <span>
                        {t.dueDate}: {formatDate(task.dueDate, language)}
                        {overdue ? ` · ${t.overdue}` : ''}
                      </span>
                    )}
                  </div>
                </label>
                <em>
                  <StatusBadge status={done ? 'approved' : overdue ? 'rejected' : 'pending'} label={done ? t.taskDone : overdue ? t.overdue : t.taskPending} />
                </em>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
