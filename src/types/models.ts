export type EmployeeStatus = 'Active' | 'On Leave' | 'Suspended' | 'Terminated'
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contractor'
export type RequestStatus = 'On track' | 'At risk' | 'Completed' | 'Overdue'
export type Role = 'HR Administrator' | 'HR' | 'Manager' | 'Employee' | 'Local IT' | 'ISD' | 'Department Head'

export interface Department { id: string; name: string; head: string; employeeCount: number; color: string }
export interface Employee {
  id: number; firstName: string; lastName: string; jobTitle: string; department: string; manager: string
  employmentType: EmploymentType; status: EmployeeStatus; location: string; joined: string; email: string; initials: string
}
export type OnboardingStage = 'HR Validation' | 'Manager Approval' | 'Local IT' | 'ISD' | 'Completed'
export interface ChecklistItem { id: string; label: string; owner: string; done: boolean }
export interface Equipment { id: string; name: string; assetId: string; status: 'Ready' | 'Assigned' | 'Pending return'; condition: string }
export interface Application { id: string; name: string; owner: string; assigned: boolean }
export interface OnboardingRequest { id: string; employee: string; position: string; department: string; startDate: string; stage: OnboardingStage; assignee: string; progress: number; status: RequestStatus }
export interface OffboardingRequest { id: string; employee: string; exitDate: string; reason: string; replacement: string; stage: string; progress: number; status: RequestStatus }
export interface LeaveType { id: string; name: string; color: string; balance: number; used: number }
export interface LeaveRequest { id: string; employee: string; type: string; start: string; end: string; duration: number; backup: string; status: 'Pending' | 'Approved' | 'Rejected' }
export interface Holiday { id: string; name: string; date: string; days: number; recurring: boolean; type: 'Public' | 'Company' }
export interface Notification { id: string; title: string; detail: string; time: string; unread: boolean; type: 'warning' | 'info' | 'success' }
export interface User { id: number; name: string; title: string; role: Role; initials: string }
export interface AuditLog { id: string; action: string; actor: string; time: string; category: string }