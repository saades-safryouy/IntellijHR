import type { Employee, EmployeeNotification } from '../types/models'
import { daysUntil } from './dates'

export type PassportAlertLevel = 'expired' | '30' | '60' | '90' | null

export function passportAlertLevel(dateStr: string | null | undefined, from = new Date()): PassportAlertLevel {
  if (!dateStr) return null
  const days = daysUntil(dateStr, from)
  if (!Number.isFinite(days)) return null
  if (days < 0) return 'expired'
  if (days <= 30) return '30'
  if (days <= 60) return '60'
  if (days <= 90) return '90'
  return null
}

export function passportNotificationType(level: PassportAlertLevel) {
  if (level === 'expired') return 'passport-expired' as const
  if (level === '30') return 'passport-30' as const
  if (level === '60') return 'passport-60' as const
  if (level === '90') return 'passport-90' as const
  return null
}

export function ensurePassportNotification(
  employee: Employee,
  existing: EmployeeNotification[],
  from = new Date(),
): EmployeeNotification | null {
  const level = passportAlertLevel(employee.passportValidityDate, from)
  const type = passportNotificationType(level)
  if (!type || !employee.passportValidityDate) return null
  const already = existing.some((item) => item.userId === employee.userId && item.type === type)
  if (already) return null
  return {
    id: `passport-${employee.userId}-${type}`,
    userId: employee.userId,
    type,
    createdAt: from.toISOString(),
    read: false,
    params: { date: employee.passportValidityDate, days: String(daysUntil(employee.passportValidityDate, from)) },
  }
}
