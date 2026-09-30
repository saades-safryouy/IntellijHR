export type EmployeeStatus = 'Active' | 'On Leave' | 'Suspended' | 'Terminated'
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contractor'
export type RequestStatus = 'On track' | 'At risk' | 'Completed' | 'Overdue'
export type Role = 'HR Administrator' | 'HR' | 'Manager' | 'Employee' | 'Local IT' | 'ISD' | 'Department Head'
export type MaritalStatus = 'Single' | 'Married' | 'Divorced' | 'Widowed'
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'
export type HalfDay = 'full' | 'AM' | 'PM'
export type HolidayKind = 'Public' | 'Company'

export interface Department {
  id: string
  name: string
  head: string
  employeeCount: number
  color: string
}

export interface Employee {
  id: number
  firstName: string
  lastName: string
  jobTitle: string
  department: string
  manager: string
  employmentType: EmploymentType
  status: EmployeeStatus
  location: string
  country: string
  joined: string
  email: string
  initials: string
  userId: number
  role?: Role
  gender: 'Male' | 'Female'
  maritalStatus: MaritalStatus
  numberOfChildren: number
  nationalId: string
  nationalityId: number
  passportNumber: string | null
  passportValidityDate: string | null
  personalPhone: string
  professionalPhone: string
  personalInfoCompletedAt: string | null
  personalInfoDismissedUntil: string | null
  emergencyContactName: string | null
  emergencyContactPhone: string | null
  emergencyContactRelationship: string | null
}

export type OnboardingStage = 'HR Validation' | 'Manager Approval' | 'Local IT' | 'ISD' | 'Completed'
export interface ChecklistItem {
  id: string
  label: string
  owner: string
  done: boolean
}
export interface Equipment {
  id: string
  name: string
  assetId: string
  status: 'Ready' | 'Assigned' | 'Pending return'
  condition: string
}
export interface Application {
  id: string
  name: string
  owner: string
  assigned: boolean
}

export interface OnboardingTask {
  id: string
  labelKey: string
  done: boolean
  dueDate?: string
  employeeVisible: boolean
}

export interface OnboardingRequest {
  id: string
  employee: string
  userId: number | null
  position: string
  department: string
  startDate: string
  stage: OnboardingStage
  assignee: string
  progress: number
  status: RequestStatus
  employeeTasks: OnboardingTask[]
}

export interface OffboardingRequest {
  id: string
  employee: string
  exitDate: string
  reason: string
  replacement: string
  stage: string
  progress: number
  status: RequestStatus
}

export interface LeaveType {
  id: string
  nameKey: string
  color: string
  paid: boolean
}

export interface EmployeeLeaveEntitlement {
  userId: number
  typeId: string
  entitlement: number
}

export interface LeaveRequest {
  id: string
  userId: number
  employee: string
  typeId: string
  type: string
  start: string
  end: string
  fromHalf: HalfDay
  toHalf: HalfDay
  duration: number
  backup: string
  backupUserId: number | null
  note: string
  status: LeaveStatus
  submittedAt: string
}

export interface Holiday {
  id: string
  name: string
  nameKey?: string
  date: string
  days: number
  recurring: boolean
  type: HolidayKind
  country: string | null
  site: string | null
}

export interface Notification {
  id: string
  title: string
  detail: string
  time: string
  unread: boolean
  type: 'warning' | 'info' | 'success'
}

export type EmployeeNotificationType =
  | 'leave-approved'
  | 'leave-rejected'
  | 'leave-submitted'
  | 'onboarding-update'
  | 'profile-reminder'
  | 'passport-90'
  | 'passport-60'
  | 'passport-30'
  | 'passport-expired'
  | 'backup-assignment'

export interface EmployeeNotification {
  id: string
  userId: number
  type: EmployeeNotificationType
  createdAt: string
  read: boolean
  params?: Record<string, string>
}

export interface User {
  id: number
  name: string
  title: string
  role: Role
  initials: string
  email: string
  userId?: number
  firstName?: string
  lastName?: string
  jobTitle?: string
  department?: string
  manager?: string
  location?: string
  employmentType?: EmploymentType
  status?: EmployeeStatus
  joined?: string
}

export interface AuditLog {
  id: string
  action: string
  actor: string
  time: string
  category: string
}

export const ONBOARDING_STAGE_ORDER: OnboardingStage[] = [
  'HR Validation',
  'Manager Approval',
  'Local IT',
  'ISD',
  'Completed',
]

export const NATIONALITIES: Record<number, { code: string; key: string }> = {
  1: { code: 'MA', key: 'nationalityMA' },
  2: { code: 'FR', key: 'nationalityFR' },
}
