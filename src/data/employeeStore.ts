 /**
 * EmployeeStore — centralised local-persistence layer for the Employee MVP.
 *
 * Every employee-facing page reads/writes through this module so the mock
 * persistence can later be swapped for REST calls in a single file.
 */

import { readJson, writeJson } from '../lib/storage'
import type {
  Employee,
  EmployeeLeaveEntitlement,
  EmployeeNotification,
  Holiday,
  LeaveRequest,
  LeaveType,
  OnboardingRequest,
} from '../types/models'
import {
  employees as seedEmployees,
  holidays as seedHolidays,
  leaveEntitlements as seedEntitlements,
  leaveRequests as seedLeave,
  leaveTypes as seedTypes,
  onboardingRequests as seedOnboarding,
  seedEmployeeNotifications,
} from '../data/mock'
import { ensurePassportNotification } from '../utils/passport'
import { calculateProfileCompletion } from '../utils/profileCompletion'

// ── keys ────────────────────────────────────────────────────────────────
const K = {
  employees: 'emp-profiles',
  leave: 'emp-leave-requests',
  notifications: 'emp-notifications',
  onboardingTasks: 'emp-onboarding-tasks',
} as const

// ── initialisation (seed once, then localStorage owns the data) ─────────
function init<T>(key: string, seed: T): T {
  const stored = readJson<T>(key)
  if (stored) return stored
  writeJson(key, seed)
  return seed
}

// ── employees ───────────────────────────────────────────────────────────
let _employees = init<Employee[]>(K.employees, seedEmployees)

export function getEmployees(): Employee[] {
  return _employees
}

export function getEmployee(userId: number): Employee | undefined {
  return _employees.find((emp) => emp.userId === userId)
}

const listeners = new Set<() => void>()

function notify(): void {
  listeners.forEach((listener) => listener())
}

export function subscribeEmployeeStore(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function resolveEmployee(
  currentUser: { id: number; userId?: number; email: string } | null,
): Employee | undefined {
  if (!currentUser) return undefined
  const uid = currentUser.userId ?? currentUser.id
  const byUserId = _employees.find((emp) => emp.userId === uid)
  if (byUserId) return byUserId
  if (currentUser.email) {
    return _employees.find(
      (emp) => emp.email.toLowerCase() === currentUser.email.toLowerCase(),
    )
  }
  return undefined
}

export function updateEmployeeProfile(
  userId: number,
  patch: Partial<Pick<Employee,
    'personalPhone' | 'professionalPhone' | 'maritalStatus' | 'numberOfChildren' |
    'emergencyContactName' | 'emergencyContactPhone' | 'emergencyContactRelationship' |
    'personalInfoCompletedAt' | 'personalInfoDismissedUntil'
  >>,
): Employee | undefined {
  _employees = _employees.map((emp) =>
    emp.userId === userId ? { ...emp, ...patch } : emp,
  )
  writeJson(K.employees, _employees)
  notify()
  return _employees.find((emp) => emp.userId === userId)
}

// ── leave ───────────────────────────────────────────────────────────────
let _leave = init<LeaveRequest[]>(K.leave, seedLeave)

export function getLeaveTypes(): LeaveType[] {
  return seedTypes
}

export function getLeaveEntitlements(): EmployeeLeaveEntitlement[] {
  return seedEntitlements
}

export function getLeaveRequests(): LeaveRequest[] {
  return _leave
}

export function getMyLeaveRequests(userId: number): LeaveRequest[] {
  return _leave.filter((req) => req.userId === userId)
}

function getNextLeaveId(): string {
  const nums = _leave
    .map((r) => {
      const match = r.id.match(/^LV-(\d+)$/)
      return match ? parseInt(match[1], 10) : 0
    })
    .filter((n) => !isNaN(n))
  const max = nums.length > 0 ? Math.max(...nums) : 399
  return `LV-${max + 1}`
}

export function submitLeaveRequest(req: Omit<LeaveRequest, 'id'>): LeaveRequest {
  const created: LeaveRequest = { ...req, id: getNextLeaveId() }
  _leave = [created, ..._leave]
  writeJson(K.leave, _leave)
  notify()

  // auto-notify the backup
  if (created.backupUserId) {
    const employee = _employees.find((emp) => emp.userId === req.userId)
    addEmployeeNotification({
      id: `en-backup-${created.id}`,
      userId: created.backupUserId,
      type: 'backup-assignment',
      createdAt: new Date().toISOString(),
      read: false,
      params: {
        employee: employee ? `${employee.firstName} ${employee.lastName}` : '',
        requestId: created.id,
      },
    })
  }

  // auto-notify the requester
  addEmployeeNotification({
    id: `en-leave-sub-${created.id}`,
    userId: req.userId,
    type: 'leave-submitted',
    createdAt: new Date().toISOString(),
    read: false,
    params: { requestId: created.id },
  })

  return created
}

export function cancelLeaveRequest(requestId: string, userId: number): boolean {
  const req = _leave.find((r) => r.id === requestId && r.userId === userId)
  if (!req || req.status !== 'pending') return false
  _leave = _leave.map((r) => (r.id === requestId ? { ...r, status: 'cancelled' as const } : r))
  writeJson(K.leave, _leave)
  notify()
  return true
}

// ── holidays ────────────────────────────────────────────────────────────
export function getHolidays(): Holiday[] {
  return seedHolidays
}

// ── onboarding ──────────────────────────────────────────────────────────
let _obTasks = init<Record<string, boolean>>(K.onboardingTasks, {})

export function getOnboardingRequests(): OnboardingRequest[] {
  return seedOnboarding
}

export function getMyOnboarding(userId: number): OnboardingRequest | undefined {
  return seedOnboarding.find((req) => req.userId === userId)
}

export function isOnboardingTaskDone(taskId: string, request: OnboardingRequest): boolean {
  if (_obTasks[taskId] !== undefined) return _obTasks[taskId]
  return request.employeeTasks.find((task) => task.id === taskId)?.done ?? false
}

export function toggleOnboardingTask(taskId: string, done: boolean): void {
  _obTasks = { ..._obTasks, [taskId]: done }
  writeJson(K.onboardingTasks, _obTasks)
  notify()
}

// ── notifications ───────────────────────────────────────────────────────
let _notifs = init<EmployeeNotification[]>(K.notifications, seedEmployeeNotifications)

export function getMyNotifications(userId: number): EmployeeNotification[] {
  return _notifs.filter((n) => n.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function getUnreadCount(userId: number): number {
  return _notifs.filter((n) => n.userId === userId && !n.read).length
}

export function markNotificationRead(notifId: string): void {
  _notifs = _notifs.map((n) => (n.id === notifId ? { ...n, read: true } : n))
  writeJson(K.notifications, _notifs)
  notify()
}

export function markAllNotificationsRead(userId: number): void {
  _notifs = _notifs.map((n) => (n.userId === userId ? { ...n, read: true } : n))
  writeJson(K.notifications, _notifs)
  notify()
}

export function addEmployeeNotification(notif: EmployeeNotification): void {
  if (_notifs.some((n) => n.id === notif.id)) return
  _notifs = [notif, ..._notifs]
  writeJson(K.notifications, _notifs)
  notify()
}

/**
 * Generate dynamic passport notifications for an employee if they don't
 * already exist in the store.  Called on dashboard mount.
 */
export function ensureDynamicNotifications(employee: Employee): void {
  const passportNotif = ensurePassportNotification(employee, _notifs)
  if (passportNotif) addEmployeeNotification(passportNotif)

  const { percentage } = calculateProfileCompletion(employee)

  if (
    percentage < 100 &&
    !_notifs.some(
      (item) =>
        item.userId === employee.userId &&
        item.type === 'profile-reminder'
    )
  ) {
    addEmployeeNotification({
      id: `profile-reminder-${employee.userId}`,
      userId: employee.userId,
      type: 'profile-reminder',
      createdAt: new Date().toISOString(),
      read: false,
    })
  }
}