export function StatusBadge({
  status,
  label,
}: {
  status: string
  label?: string
}) {
  const normalized = (status || '').toLowerCase()
  let css = 'info'
  if (
    normalized.includes('approv') ||
    normalized === 'active' ||
    normalized === 'valid' ||
    normalized === 'completed' ||
    normalized === 'full-time'
  ) {
    css = 'approved'
  } else if (
    normalized.includes('reject') ||
    normalized === 'expired' ||
    normalized === 'missing' ||
    normalized === 'overdue' ||
    normalized === 'terminated' ||
    normalized === 'suspended'
  ) {
    css = 'rejected'
  } else if (
    normalized.includes('pend') ||
    normalized === 'on leave' ||
    normalized.includes('soon') ||
    normalized === 'at risk'
  ) {
    css = 'pending'
  } else if (normalized.includes('cancel')) {
    css = 'cancelled'
  } else {
    css = normalized.replace(/\s+/g, '-')
  }

  return (
    <span className={`status-badge ${css}`}>
      {label ?? status}
    </span>
  )
}
