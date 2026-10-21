import { readJson, writeJson } from '../lib/storage'
import type {
  Employee,
  EmployeeLeaveEntitlement,
  EmployeeNotification,
  Holiday,
  LeaveRequest,
  LeaveType,
  OffboardingRequest,
  OnboardingRequest,
} from '../types/models'
import {
  employees as seedEmployees,
  holidays as seedHolidays,
  leaveEntitlements as seedEntitlements,
  leaveRequests as seedLeave,
  leaveTypes as seedTypes,
  onboardingRequests as seedOnboarding,
  offboardingRequests as seedOffboarding,
  seedEmployeeNotifications,
} from '../data/mock'
import { ensurePassportNotification } from '../utils/passport'
import { calculateProfileCompletion } from '../utils/profileCompletion'

const K = {
  employees: 'emp-profiles',
  leave: 'emp-leave-requests',
  notifications: 'emp-notifications',
  onboardingRequests: 'emp-onboarding-requests',
  onboardingTaskState: 'emp-onboarding-task-state',
  offboardingTasks: 'emp-offboarding-tasks',
  leaveEntitlements: 'emp-leave-entitlements',
  leaveTypes: 'emp-leave-types',
  holidays: 'emp-holidays',
} as const

function init<T>(key: string, seed: T): T {
  const stored = readJson<T>(key)
  if (stored) return stored
  const initial = structuredClone(seed)
  writeJson(key, initial)
  return initial
}

const listeners = new Set<() => void>()

function notify(): void {
  listeners.forEach((listener) => listener())
}

export function subscribeEmployeeStore(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

let _employees = init<Employee[]>(K.employees, seedEmployees)
let _leaveRequests = init<LeaveRequest[]>(K.leave, seedLeave)
let _leaveEntitlements = init<EmployeeLeaveEntitlement[]>(K.leaveEntitlements, seedEntitlements)
let _leaveTypes = init<LeaveType[]>(K.leaveTypes, seedTypes)
let _holidays = init<Holiday[]>(K.holidays, seedHolidays)
let _onboardingRequests = init<OnboardingRequest[]>(K.onboardingRequests, seedOnboarding)
let _offboardingTasks = init<OffboardingRequest[]>(K.offboardingTasks, seedOffboarding)
let _notifications = init<EmployeeNotification[]>(K.notifications, seedEmployeeNotifications)
let _onboardingTaskState = init<Record<string, boolean>>(K.onboardingTaskState, {})

function mergeDemoRecords<T extends { id: string | number }>(current: T[], seeded: T[]): T[] {
  const seedIds = new Set(seeded.map((record) => record.id))
  return [...structuredClone(seeded), ...current.filter((record) => !seedIds.has(record.id))]
}

function mergeDemoRecordsByKey<T>(current: T[], seeded: T[], keyOf: (record: T) => string): T[] {
  const seedKeys = new Set(seeded.map(keyOf))
  return [...structuredClone(seeded), ...current.filter((record) => !seedKeys.has(keyOf(record)))]
}

export function resetDemoData(confirmed: boolean): void {
  if (!confirmed) throw new Error('Demo data reset requires explicit confirmation.')

  _employees = mergeDemoRecords(_employees, seedEmployees)
  _leaveRequests = mergeDemoRecords(_leaveRequests, seedLeave)
  _leaveEntitlements = mergeDemoRecordsByKey(
    _leaveEntitlements,
    seedEntitlements,
    (item) => `${item.userId}:${item.typeId}`,
  )
  _leaveTypes = mergeDemoRecords(_leaveTypes, seedTypes)
  _holidays = mergeDemoRecords(_holidays, seedHolidays)
  _onboardingRequests = mergeDemoRecords(_onboardingRequests, seedOnboarding)
  _offboardingTasks = mergeDemoRecords(_offboardingTasks, seedOffboarding)
  _notifications = mergeDemoRecords(_notifications, seedEmployeeNotifications)

  const seededTaskIds = new Set(seedOnboarding.flatMap((request) => request.employeeTasks.map((task) => task.id)))
  _onboardingTaskState = Object.fromEntries(
    Object.entries(_onboardingTaskState).filter(([taskId]) => !seededTaskIds.has(taskId)),
  )

  writeJson(K.employees, _employees)
  writeJson(K.leave, _leaveRequests)
  writeJson(K.leaveEntitlements, _leaveEntitlements)
  writeJson(K.leaveTypes, _leaveTypes)
  writeJson(K.holidays, _holidays)
  writeJson(K.onboardingRequests, _onboardingRequests)
  writeJson(K.offboardingTasks, _offboardingTasks)
  writeJson(K.notifications, _notifications)
  writeJson(K.onboardingTaskState, _onboardingTaskState)
  notify()
}

export function getEmployees(): Employee[] {
  return _employees
}

export function getEmployeeById(id: number): Employee | null {
  return _employees.find((employee) => employee.id === id) ?? null
}

export function getEmployee(userId: number): Employee | undefined {
  return _employees.find((employee) => employee.userId === userId)
}

export function createEmployee(employee: Omit<Employee, 'id'>): Employee {
  const nextId = _employees.reduce((maxId, current) => Math.max(maxId, current.id), 0) + 1
  const created = { ...employee, id: nextId }
  _employees = [created, ..._employees]
  writeJson(K.employees, _employees)
  notify()
  return created
}

export function updateEmployee(id: number, updates: Partial<Employee>): Employee | null {
  const index = _employees.findIndex((employee) => employee.id === id)
  if (index === -1) return null
  _employees = _employees.map((employee, employeeIndex) =>
    employeeIndex === index ? { ...employee, ...updates } : employee,
  )
  writeJson(K.employees, _employees)
  notify()
  return _employees[index]
}

export function deleteEmployee(id: number): boolean {
  if (!_employees.some((employee) => employee.id === id)) return false
  _employees = _employees.filter((employee) => employee.id !== id)
  writeJson(K.employees, _employees)
  notify()
  return true
}

export function resolveEmployee(
  currentUser: { id: number | string; userId?: number | string; email?: string } | null,
): Employee | undefined {
  if (!currentUser) return undefined
  const uid = currentUser.userId ?? currentUser.id
  if (typeof uid === 'string') {
    return _employees.find((employee) => employee.authUserId === uid)
  }
  const byUserId = _employees.find((employee) => employee.userId === uid)
  if (byUserId) return byUserId
  if (currentUser.email) {
    return _employees.find(
      (employee) => employee.email.toLowerCase() === currentUser.email!.toLowerCase(),
    )
  }
  return undefined
}

export function updateEmployeeProfile(
  userId: number,
  patch: Partial<
    Pick<
      Employee,
      | 'personalPhone'
      | 'professionalPhone'
      | 'maritalStatus'
      | 'numberOfChildren'
      | 'emergencyContactName'
      | 'emergencyContactPhone'
      | 'emergencyContactRelationship'
      | 'personalInfoCompletedAt'
      | 'personalInfoDismissedUntil'
    >
  >,
): Employee | undefined {
  _employees = _employees.map((employee) =>
    employee.userId === userId ? { ...employee, ...patch } : employee,
  )
  writeJson(K.employees, _employees)
  notify()
  return _employees.find((employee) => employee.userId === userId)
}

export function getLeaveRequests(): LeaveRequest[] {
  return _leaveRequests
}

export function getLeaveRequestsByEmployee(employeeId: number): LeaveRequest[] {
  return _leaveRequests.filter((request) => request.userId === employeeId)
}

export function createLeaveRequest(request: Omit<LeaveRequest, 'id'>): LeaveRequest {
  const nextId = (() => {
    const ids = _leaveRequests
      .map((entry) => Number.parseInt((entry.id.match(/\d+/) ?? [])[0] ?? '0', 10))
      .filter((value) => Number.isFinite(value))
    return `LV-${(ids.length ? Math.max(...ids) : 0) + 1}`
  })()

  const created: LeaveRequest = { ...request, id: nextId }
  _leaveRequests = [created, ..._leaveRequests]
  writeJson(K.leave, _leaveRequests)
  notify()
  return created
}

export function updateLeaveRequest(id: string, updates: Partial<LeaveRequest>): LeaveRequest | null {
  const index = _leaveRequests.findIndex((request) => request.id === id)
  if (index === -1) return null
  _leaveRequests[index] = { ..._leaveRequests[index], ...updates }
  writeJson(K.leave, _leaveRequests)
  notify()
  return _leaveRequests[index]
}

export function deleteLeaveRequest(id: string): boolean {
  const index = _leaveRequests.findIndex((request) => request.id === id)
  if (index === -1) return false
  _leaveRequests.splice(index, 1)
  writeJson(K.leave, _leaveRequests)
  notify()
  return true
}

export function getLeaveEntitlements(): EmployeeLeaveEntitlement[] {
  return _leaveEntitlements
}

export function getLeaveEntitlementByEmployee(employeeId: number): EmployeeLeaveEntitlement | null {
  return _leaveEntitlements.find((entitlement) => entitlement.userId === employeeId) ?? null
}

export function updateLeaveEntitlement(
  employeeId: number,
  updates: Partial<EmployeeLeaveEntitlement>,
): EmployeeLeaveEntitlement | null {
  const index = _leaveEntitlements.findIndex((entitlement) => entitlement.userId === employeeId)
  if (index === -1) return null
  _leaveEntitlements[index] = { ..._leaveEntitlements[index], ...updates }
  writeJson(K.leaveEntitlements, _leaveEntitlements)
  notify()
  return _leaveEntitlements[index]
}

export function getLeaveTypes(): LeaveType[] {
  return _leaveTypes
}

export function getHolidays(): Holiday[] {
  return _holidays
}

export function getOnboardingRequests(): OnboardingRequest[] {
  return _onboardingRequests
}

export function getOnboardingTasks(): OnboardingRequest[] {
  return _onboardingRequests
}

export function getOnboardingTasksByEmployee(employeeId: number): OnboardingRequest[] {
  return _onboardingRequests.filter((request) => request.userId === employeeId)
}

export function createOnboardingTask(task: Omit<OnboardingRequest, 'id'>): OnboardingRequest {
  const newTask: OnboardingRequest = {
    ...task,
    id: `OB-${Date.now()}`,
  }
  _onboardingRequests = [newTask, ..._onboardingRequests]
  writeJson(K.onboardingRequests, _onboardingRequests)
  notify()
  return newTask
}

export function updateOnboardingTask(
  id: string,
  updates: Partial<OnboardingRequest>,
): OnboardingRequest | null {
  const index = _onboardingRequests.findIndex((request) => request.id === id)
  if (index === -1) return null
  _onboardingRequests[index] = { ..._onboardingRequests[index], ...updates }
  writeJson(K.onboardingRequests, _onboardingRequests)
  notify()
  return _onboardingRequests[index]
}

export function deleteOnboardingTask(id: string): boolean {
  const index = _onboardingRequests.findIndex((request) => request.id === id)
  if (index === -1) return false
  _onboardingRequests.splice(index, 1)
  writeJson(K.onboardingRequests, _onboardingRequests)
  notify()
  return true
}

export function getOffboardingTasks(): OffboardingRequest[] {
  return _offboardingTasks
}

export function getOffboardingTasksByEmployee(employeeId: number): OffboardingRequest[] {
  const employee = getEmployeeById(employeeId)
  const name = employee ? `${employee.firstName} ${employee.lastName}` : ''
  return _offboardingTasks.filter(
    (task) => task.employee === name || (task as Partial<{ userId: number }>).userId === employeeId,
  )
}

export function createOffboardingTask(task: Omit<OffboardingRequest, 'id'>): OffboardingRequest {
  const newTask: OffboardingRequest = {
    ...task,
    id: `OFF-${Date.now()}`,
  }
  _offboardingTasks = [newTask, ..._offboardingTasks]
  writeJson(K.offboardingTasks, _offboardingTasks)
  notify()
  return newTask
}

export function updateOffboardingTask(
  id: string,
  updates: Partial<OffboardingRequest>,
): OffboardingRequest | null {
  const index = _offboardingTasks.findIndex((task) => task.id === id)
  if (index === -1) return null
  _offboardingTasks[index] = { ..._offboardingTasks[index], ...updates }
  writeJson(K.offboardingTasks, _offboardingTasks)
  notify()
  return _offboardingTasks[index]
}

export function deleteOffboardingTask(id: string): boolean {
  const index = _offboardingTasks.findIndex((task) => task.id === id)
  if (index === -1) return false
  _offboardingTasks.splice(index, 1)
  writeJson(K.offboardingTasks, _offboardingTasks)
  notify()
  return true
}

export function updateOffboardingTaskItem(
  taskId: string,
  itemIndex: number,
  updates: Record<string, unknown>,
): OffboardingRequest | null {
  const index = _offboardingTasks.findIndex((task) => task.id === taskId)
  if (index === -1) return null

  const task = _offboardingTasks[index] as OffboardingRequest & { items?: Array<Record<string, unknown>> }
  if (!task.items || itemIndex < 0 || itemIndex >= task.items.length) return null

  task.items[itemIndex] = { ...task.items[itemIndex], ...updates }
  _offboardingTasks[index] = task
  writeJson(K.offboardingTasks, _offboardingTasks)
  notify()
  return task
}

export function getNotifications(): EmployeeNotification[] {
  return _notifications
}

export function getMyNotifications(userId: number): EmployeeNotification[] {
  return _notifications
    .filter((notification) => notification.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function getUnreadCount(userId: number): number {
  return _notifications.filter((notification) => notification.userId === userId && !notification.read).length
}

export function addNotification(notification: Omit<EmployeeNotification, 'id'>): EmployeeNotification {
  const newNotification: EmployeeNotification = {
    ...notification,
    id: `ntf-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
  }
  _notifications = [newNotification, ..._notifications]
  writeJson(K.notifications, _notifications)
  notify()
  return newNotification
}

export function addEmployeeNotification(notification: EmployeeNotification): void {
  if (_notifications.some((item) => item.id === notification.id)) return
  _notifications = [notification, ..._notifications]
  writeJson(K.notifications, _notifications)
  notify()
}

export function markNotificationRead(notifId: string): void {
  _notifications = _notifications.map((notification) =>
    notification.id === notifId ? { ...notification, read: true } : notification,
  )
  writeJson(K.notifications, _notifications)
  notify()
}

export function markNotificationAsRead(id: string): void {
  markNotificationRead(id)
}

export function markAllNotificationsRead(userId: number): void {
  _notifications = _notifications.map((notification) =>
    notification.userId === userId ? { ...notification, read: true } : notification,
  )
  writeJson(K.notifications, _notifications)
  notify()
}

export function dismissNotification(id: string): boolean {
  const index = _notifications.findIndex((notification) => notification.id === id)
  if (index === -1) return false
  _notifications.splice(index, 1)
  writeJson(K.notifications, _notifications)
  notify()
  return true
}

export function getProfileCompletion(employeeId: number) {
  const employee = getEmployeeById(employeeId)
  return employee ? calculateProfileCompletion(employee) : null
}

export function checkPassportNotifications(employeeId: number): void {
  const employee = getEmployeeById(employeeId)
  if (!employee) return
  const notification = ensurePassportNotification(employee, _notifications)
  if (notification) addEmployeeNotification(notification)
}

export function getMyOnboarding(userId: number): OnboardingRequest | undefined {
  return _onboardingRequests.find((request) => request.userId === userId)
}

export function isOnboardingTaskDone(taskId: string, request: OnboardingRequest): boolean {
  if (_onboardingTaskState[taskId] !== undefined) return _onboardingTaskState[taskId]
  return request.employeeTasks.find((task) => task.id === taskId)?.done ?? false
}

export function toggleOnboardingTask(taskId: string, done: boolean): void {
  _onboardingTaskState = { ..._onboardingTaskState, [taskId]: done }
  writeJson(K.onboardingTaskState, _onboardingTaskState)
  notify()
}

export function getMyLeaveRequests(userId: number): LeaveRequest[] {
  return _leaveRequests.filter((request) => request.userId === userId)
}

function getNextLeaveId(): string {
  const ids = _leaveRequests
    .map((request) => Number.parseInt((request.id.match(/\d+/) ?? [])[0] ?? '0', 10))
    .filter((value) => Number.isFinite(value))
  const max = ids.length ? Math.max(...ids) : 0
  return `LV-${max + 1}`
}

export function submitLeaveRequest(req: Omit<LeaveRequest, 'id'>): LeaveRequest {
  const created: LeaveRequest = { ...req, id: getNextLeaveId() }
  _leaveRequests = [created, ..._leaveRequests]
  writeJson(K.leave, _leaveRequests)
  notify()

  if (created.backupUserId) {
    const employee = _employees.find((item) => item.userId === req.userId)
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
  const request = _leaveRequests.find((entry) => entry.id === requestId && entry.userId === userId)
  if (!request || request.status !== 'pending') return false
  _leaveRequests = _leaveRequests.map((entry) =>
    entry.id === requestId ? { ...entry, status: 'cancelled' as const } : entry,
  )
  writeJson(K.leave, _leaveRequests)
  notify()
  return true
}

export function approveLeaveRequest(requestId: string): boolean {
  const request = _leaveRequests.find((entry) => entry.id === requestId)
  if (!request || request.status !== 'pending') return false
  _leaveRequests = _leaveRequests.map((entry) =>
    entry.id === requestId ? { ...entry, status: 'approved' as const } : entry,
  )
  writeJson(K.leave, _leaveRequests)
  notify()
  addEmployeeNotification({
    id: `en-leave-approved-${request.id}`,
    userId: request.userId,
    type: 'leave-approved',
    createdAt: new Date().toISOString(),
    read: false,
    params: { requestId: request.id, days: String(request.duration) },
  })
  return true
}

export function rejectLeaveRequest(requestId: string): boolean {
  const request = _leaveRequests.find((entry) => entry.id === requestId)
  if (!request || request.status !== 'pending') return false
  _leaveRequests = _leaveRequests.map((entry) =>
    entry.id === requestId ? { ...entry, status: 'rejected' as const } : entry,
  )
  writeJson(K.leave, _leaveRequests)
  notify()
  addEmployeeNotification({
    id: `en-leave-rejected-${request.id}`,
    userId: request.userId,
    type: 'leave-rejected',
    createdAt: new Date().toISOString(),
    read: false,
    params: { requestId: request.id },
  })
  return true
}

export function ensureDynamicNotifications(employee: Employee): void {
  const passportNotif = ensurePassportNotification(employee, _notifications)
  if (passportNotif) addEmployeeNotification(passportNotif)

  const { percentage } = calculateProfileCompletion(employee)
  if (
    percentage < 100 &&
    !_notifications.some(
      (item) => item.userId === employee.userId && item.type === 'profile-reminder',
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
