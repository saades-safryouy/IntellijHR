import { AlertCircle } from 'lucide-react'
import { useI18n } from '../../contexts/I18nContext'

interface ConfirmDialogProps {
  title: string
  message: string
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  confirmLabel?: string
  cancelLabel?: string
  isDangerous?: boolean
  isLoading?: boolean
}

export function ConfirmDialog({
  title,
  message,
  isOpen,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDangerous = false,
  isLoading = false,
}: ConfirmDialogProps) {
  useI18n()

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content modal-confirm" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon" style={{ color: isDangerous ? '#ef4444' : '#3b82f6' }}>
          <AlertCircle size={32} />
        </div>

        <h2>{title}</h2>
        <p>{message}</p>

        <div className="modal-footer">
          <button className="button secondary" onClick={onCancel} disabled={isLoading}>
            {cancelLabel}
          </button>
          <button
            className={`button ${isDangerous ? 'danger' : 'primary'}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? `${confirmLabel}...` : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
