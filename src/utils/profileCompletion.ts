import type { Employee } from '../types/models'
import { parseDate, startOfDay } from './dates'

export const PROFILE_FIELDS = [
  'personalPhone',
  'professionalPhone',
  'maritalStatus',
  'numberOfChildren',
  'emergencyContactName',
  'emergencyContactPhone',
  'emergencyContactRelationship',
] as const

export type ProfileField = (typeof PROFILE_FIELDS)[number]

export function calculateProfileCompletion(emp: Employee): {
  percentage: number
  missing: ProfileField[]
} {
  const missing: ProfileField[] = []

  if (!emp.personalPhone?.trim()) missing.push('personalPhone')
  if (!emp.professionalPhone?.trim()) missing.push('professionalPhone')
  if (!emp.maritalStatus) missing.push('maritalStatus')
  if (emp.numberOfChildren === undefined || emp.numberOfChildren === null) missing.push('numberOfChildren')
  if (!emp.emergencyContactName?.trim()) missing.push('emergencyContactName')
  if (!emp.emergencyContactPhone?.trim()) missing.push('emergencyContactPhone')
  if (!emp.emergencyContactRelationship?.trim()) missing.push('emergencyContactRelationship')

  const completed = PROFILE_FIELDS.length - missing.length
  return {
    percentage: Math.round((completed / PROFILE_FIELDS.length) * 100),
    missing,
  }
}

export function isProfileReminderSnoozed(emp: Employee, from = new Date()): boolean {
  if (!emp.personalInfoDismissedUntil) return false
  const until = parseDate(emp.personalInfoDismissedUntil)
  if (!until) return false
  return until.getTime() >= startOfDay(from).getTime()
}

export function shouldShowProfileReminder(emp: Employee, from = new Date()): boolean {
  const { percentage } = calculateProfileCompletion(emp)
  if (percentage === 100) return false
  return !isProfileReminderSnoozed(emp, from)
}
