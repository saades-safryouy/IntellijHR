import { CalendarDays, ChevronRight, Plus } from 'lucide-react'
import { PageHeader } from '../../components/common/PageHeader'

export function CalendarPage() {
  return (
    <div className="page">
      <PageHeader
        eyebrow="PLANNING HUB"
        title="HR calendar"
        subtitle="See leave, holidays and people milestones in one shared view."
      >
        <button className="button secondary">
          <CalendarDays size={16} />
          Agenda
        </button>

        <button className="button primary">
          <Plus size={16} />
          Add event
        </button>
      </PageHeader>

      <section className="panel calendar-panel">
        <div className="calendar-toolbar">
          <button className="icon-button">
            <ChevronRight size={17} />
          </button>

          <strong>September 2026</strong>

          <button className="icon-button">
            <ChevronRight size={17} />
          </button>

          <div className="view-switch">
            <button className="active">Month</button>
            <button>Week</button>
            <button>Agenda</button>
          </div>
        </div>

        <div className="calendar-grid">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <span className="calendar-day-name" key={day}>
              {day}
            </span>
          ))}

          {Array.from({ length: 35 }, (_, index) => (
            <div
              className={`calendar-cell ${
                index === 9 || index === 10 ? 'selected' : ''
              }`}
              key={index}
            >
              <span>{index < 1 ? '' : ((index + 31) % 30) + 1}</span>
              {index === 14 && (
                <i className="calendar-event blue">Leadership sync</i>
              )}
              {index === 16 && (
                <i className="calendar-event mint">Sara · Leave</i>
              )}
              {index === 25 && (
                <i className="calendar-event orange">Company holiday</i>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
