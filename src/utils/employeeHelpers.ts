import type { Employee, User } from '../types/models'

export function employeeFullName(employee: Pick<Employee, 'firstName' | 'lastName'>): string {
  return `${employee.firstName} ${employee.lastName}`.trim()
}

export function resolveEmployee(
  currentUser: (User & Partial<Employee>) | null,
  directory: Employee[],
): Employee | undefined {
  if (!currentUser) return undefined

  return directory.find(
    (employee) =>
      employee.email === currentUser.email ||
      employee.id === currentUser.id ||
      employee.userId === currentUser.id ||
      employee.userId === currentUser.userId,
  )
}

export function calculateProfileCompletion(emp: Employee): {
  percentage: number
  missing: string[]
} {
  const missing: string[] = []
  let completed = 0
  const totalFields = 5

  if (!emp.personalPhone) missing.push('personalPhone')
  else completed++

  if (!emp.professionalPhone) missing.push('professionalPhone')
  else completed++

  if (!emp.maritalStatus) missing.push('maritalStatus')
  else completed++

  if (emp.numberOfChildren === undefined || emp.numberOfChildren === null)
    missing.push('numberOfChildren')
  else completed++

  if (!emp.passportValidityDate) missing.push('passportValidity')
  else completed++

  return {
    percentage: Math.round((completed / totalFields) * 100),
    missing,
  }
}

export function getGreeting(language: string): string {
  const hour = new Date().getHours()
  const period = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'
  const greetings: Record<string, Record<string, string>> = {
    en: { morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening' },
    fr: { morning: 'Bonjour', afternoon: 'Bon après-midi', evening: 'Bonsoir' },
    ar: { morning: 'صباح الخير', afternoon: 'مساء الخير', evening: 'مساء الخير' },
  }
  return greetings[language]?.[period] || greetings.en[period]
}

export function formatDate(dateStr: string, language: string = 'en'): string {
  const parsed = Date.parse(dateStr)
  if (Number.isNaN(parsed)) return dateStr

  const localeMap: Record<string, string> = {
    en: 'en-GB',
    fr: 'fr-FR',
    ar: 'ar-MA',
  }

  return new Date(parsed).toLocaleDateString(localeMap[language] || 'en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatWeekday(date: Date, language: string = 'en'): string {
  const localeMap: Record<string, string> = {
    en: 'en-GB',
    fr: 'fr-FR',
    ar: 'ar-MA',
  }
  return date.toLocaleDateString(localeMap[language] || 'en-GB', { weekday: 'short' })
}

export function getWeekDays(from = new Date()): Date[] {
  const day = from.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  const monday = new Date(from)
  monday.setHours(0, 0, 0, 0)
  monday.setDate(from.getDate() + mondayOffset)

  return Array.from({ length: 7 }, (_, index) => {
    const next = new Date(monday)
    next.setDate(monday.getDate() + index)
    return next
  })
}

export function isSameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  )
}

export function daysUntil(dateStr: string): number {
  const parsed = Date.parse(dateStr)
  if (Number.isNaN(parsed)) return Number.POSITIVE_INFINITY
  const target = new Date(parsed)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / 86400000)
}

export function nextPayday(from = new Date()): Date {
  const date = new Date(from.getFullYear(), from.getMonth() + 1, 0)
  if (date.getTime() < from.getTime()) {
    return new Date(from.getFullYear(), from.getMonth() + 2, 0)
  }
  return date
}
