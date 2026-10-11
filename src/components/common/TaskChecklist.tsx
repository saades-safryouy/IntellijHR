import { CheckCircle2, Circle, Trash2, Plus } from 'lucide-react'
import { useI18n, translations } from '../../contexts/I18nContext'

interface TaskItem {
  name: string
  completed: boolean
  assignee?: string
  dueDate?: string
}

interface TaskChecklistProps {
  items: TaskItem[]
  onToggleItem: (index: number) => void
  onDeleteItem: (index: number) => void
  onAddItem?: (item: TaskItem) => void
  readOnly?: boolean
}

export function TaskChecklist({
  items,
  onToggleItem,
  onDeleteItem,
  onAddItem,
  readOnly = false,
}: TaskChecklistProps) {
  const { language } = useI18n()
  const t = translations[language]
  const completedCount = items.filter((item) => item.completed).length
  const tasksLabel = t.common?.tasks ?? 'Tasks'
  const deleteLabel = t.common?.delete ?? 'Delete'
  const addTaskLabel = t.common?.add_task ?? 'Add Task'

  return (
    <div className="task-checklist">
      <div className="checklist-header">
        <h3>
          {tasksLabel} ({completedCount}/{items.length})
        </h3>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(completedCount / items.length) * 100}%` }} />
        </div>
      </div>

      <div className="checklist-items">
        {items.map((item, index) => (
          <div key={index} className={`checklist-item ${item.completed ? 'completed' : ''}`}>
            <button
              className="checklist-checkbox"
              onClick={() => onToggleItem(index)}
              disabled={readOnly}
              type="button"
            >
              {item.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
            </button>

            <div className="item-content">
              <p className="item-name">{item.name}</p>
              {(item.assignee || item.dueDate) && (
                <div className="item-meta">
                  {item.assignee && <span className="assignee">{item.assignee}</span>}
                  {item.dueDate && <span className="due-date">{new Date(item.dueDate).toLocaleDateString()}</span>}
                </div>
              )}
            </div>

            {!readOnly && (
              <button
                className="checklist-delete"
                onClick={() => onDeleteItem(index)}
                type="button"
                aria-label={deleteLabel}
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}
      </div>

      {!readOnly && onAddItem && (
        <button className="button secondary button-small" onClick={() => onAddItem({ name: '', completed: false })}>
          <Plus size={16} />
          {addTaskLabel}
        </button>
      )}
    </div>
  )
}
