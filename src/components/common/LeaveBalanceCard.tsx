import { Calendar, AlertCircle } from 'lucide-react'
import { useI18n, translations } from '../../contexts/I18nContext'

interface LeaveBalance {
  leaveType: string
  entitledDays: number
  usedDays: number
  remainingDays: number
  pendingDays?: number
}

interface LeaveBalanceCardProps {
  balances: LeaveBalance[]
  onRequestLeave?: () => void
}

export function LeaveBalanceCard({ balances, onRequestLeave }: LeaveBalanceCardProps) {
  const { language } = useI18n()
  const t = translations[language]
  const leaveStrings = typeof t.leave === 'string' ? { label: t.leave, balance: 'Leave Balance', request: 'Request Leave', used: 'Used', pending: 'Pending', remaining: 'Remaining', low_balance: 'Low balance' } : t.leave

  return (
    <div className="leave-balance-card">
      <div className="card-header">
        <h3>
          <Calendar size={20} />
          {leaveStrings.balance || 'Leave Balance'}
        </h3>
        {onRequestLeave && (
          <button className="button primary button-small" onClick={onRequestLeave}>
            {leaveStrings.request || 'Request Leave'}
          </button>
        )}
      </div>

      <div className="balance-list">
        {balances.map((balance, index) => (
          <div key={index} className="balance-item">
            <div className="balance-header">
              <h4>{balance.leaveType}</h4>
              <span className="balance-summary">
                {balance.remainingDays} / {balance.entitledDays}
              </span>
            </div>

            <div className="balance-bar">
              <div className="balance-segment used" style={{ width: `${(balance.usedDays / balance.entitledDays) * 100}%` }}>
                <span className="segment-label">{balance.usedDays}</span>
              </div>
              {balance.pendingDays ? (
                <div
                  className="balance-segment pending"
                  style={{ width: `${(balance.pendingDays / balance.entitledDays) * 100}%` }}
                >
                  <span className="segment-label">{balance.pendingDays}</span>
                </div>
              ) : null}
            </div>

            <div className="balance-details">
              <div className="detail-item">
                <span className="label">{leaveStrings.used || 'Used'}:</span>
                <span className="value used">{balance.usedDays}</span>
              </div>
              {balance.pendingDays ? (
                <div className="detail-item">
                  <span className="label">{leaveStrings.pending || 'Pending'}:</span>
                  <span className="value pending">{balance.pendingDays}</span>
                </div>
              ) : null}
              <div className="detail-item">
                <span className="label">{leaveStrings.remaining || 'Remaining'}:</span>
                <span className="value remaining">{balance.remainingDays}</span>
              </div>
            </div>

            {balance.remainingDays <= 2 && (
              <div className="balance-warning">
                <AlertCircle size={16} />
                {leaveStrings.low_balance || 'Low balance'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
