import { X } from 'lucide-react'
import { useI18n } from '../../contexts/I18nContext'

interface FormModalProps {
  title: string
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  children: React.ReactNode
  submitLabel?: string
  isLoading?: boolean
}

export function FormModal({
  title,
  isOpen,
  onClose,
  onSubmit,
  children,
  submitLabel = 'Save',
  isLoading = false,
}: FormModalProps) {
  const { language } = useI18n()
  const cancelText = language === 'fr' ? 'Annuler' : language === 'ar' ? 'إلغاء' : 'Cancel'

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="modal-body">
          {children}

          <div className="modal-footer">
            <button type="button" className="button secondary" onClick={onClose} disabled={isLoading}>
              {cancelText}
            </button>
            <button type="submit" className="button primary" disabled={isLoading}>
              {isLoading ? `${submitLabel}...` : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
