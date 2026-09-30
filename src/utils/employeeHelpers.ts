import type { Employee, User } from '../types/models'
import { NATIONALITIES } from '../types/models'

export function employeeFullName(employee: Pick<Employee, 'firstName' | 'lastName'>): string {
  return `${employee.firstName} ${employee.lastName}`.trim()
}

/**
 * Resolve the authenticated user to their Employee record.
 * Primary key is userId. Email is a fallback only.
 * NEVER matches Employee.id === User.id (those are different namespaces).
 */
export function resolveEmployee(
  currentUser: (User & Partial<Employee>) | null,
  directory: Employee[],
): Employee | undefined {
  if (!currentUser) return undefined

  const uid = currentUser.userId ?? currentUser.id

  const byUserId = directory.find((employee) => employee.userId === uid)
  if (byUserId) return byUserId

  if (currentUser.email) {
    return directory.find(
      (employee) => employee.email.toLowerCase() === currentUser.email.toLowerCase(),
    )
  }

  return undefined
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

export function nationalityKey(nationalityId: number): string {
  return NATIONALITIES[nationalityId]?.key ?? 'nationalityMA'
}

export { calculateProfileCompletion } from './profileCompletion'
export { daysUntil, formatDate, formatWeekday, getWeekDays, isSameDay } from './dates'
