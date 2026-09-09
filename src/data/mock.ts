import type { Department, Employee, Holiday, LeaveRequest, LeaveType, Notification, OffboardingRequest, OnboardingRequest, User } from '../types/models'

export const currentUser: User = { id: 1, name: 'Saad ES-SAFRYOUY', title: 'HR Administrator', role: 'HR Administrator', initials: 'SE' }
export const departments: Department[] = [
  { id: 'eng', name: 'Engineering', head: 'Nadia Rahmani', employeeCount: 64, color: '#3b82f6' },
  { id: 'ops', name: 'Operations', head: 'Karim Haddad', employeeCount: 48, color: '#28c7a5' },
  { id: 'sales', name: 'Commercial', head: 'Maya El Amrani', employeeCount: 37, color: '#f59e0b' },
  { id: 'finance', name: 'Finance', head: 'Omar Bennani', employeeCount: 21, color: '#a78bfa' },
  { id: 'people', name: 'People & Culture', head: 'Saad ES-SAFRYOUY', employeeCount: 14, color: '#fb7185' },
]
export const employees: Employee[] = [
  { id: 1048, firstName: 'Ahmed', lastName: 'Benali', jobTitle: 'Senior Software Engineer', department: 'Engineering', manager: 'Nadia Rahmani', employmentType: 'Full-time', status: 'Active', location: 'Casablanca', joined: '12 Mar 2024', email: 'ahmed.benali@intillj.com', initials: 'AB' },
  { id: 1047, firstName: 'Sara', lastName: 'El Idrissi', jobTitle: 'Product Designer', department: 'Engineering', manager: 'Nadia Rahmani', employmentType: 'Full-time', status: 'On Leave', location: 'Rabat', joined: '03 Jun 2023', email: 'sara.elidrissi@intillj.com', initials: 'SE' },
  { id: 1046, firstName: 'Youssef', lastName: 'Alaoui', jobTitle: 'Operations Manager', department: 'Operations', manager: 'Karim Haddad', employmentType: 'Full-time', status: 'Active', location: 'Casablanca', joined: '18 Jan 2022', email: 'youssef.alaoui@intillj.com', initials: 'YA' },
  { id: 1045, firstName: 'Meriem', lastName: 'Tazi', jobTitle: 'Account Executive', department: 'Commercial', manager: 'Maya El Amrani', employmentType: 'Full-time', status: 'Active', location: 'Paris', joined: '21 Nov 2024', email: 'meriem.tazi@intillj.com', initials: 'MT' },
  { id: 1044, firstName: 'Othmane', lastName: 'Berrada', jobTitle: 'Cloud Infrastructure Lead', department: 'Engineering', manager: 'Nadia Rahmani', employmentType: 'Contractor', status: 'Active', location: 'Casablanca', joined: '06 Sep 2021', email: 'othmane.berrada@intillj.com', initials: 'OB' },
  { id: 1043, firstName: 'Lina', lastName: 'Chakir', jobTitle: 'Financial Controller', department: 'Finance', manager: 'Omar Bennani', employmentType: 'Full-time', status: 'Suspended', location: 'Rabat', joined: '14 Feb 2020', email: 'lina.chakir@intillj.com', initials: 'LC' },
]
export const onboardingRequests: OnboardingRequest[] = [
  { id: 'OB-2026-0012', employee: 'Ahmed Benali', position: 'Senior Software Engineer', department: 'Engineering', startDate: '15 Sep 2026', stage: 'ISD', assignee: 'Hicham El Mansouri', progress: 80, status: 'On track' },
  { id: 'OB-2026-0011', employee: 'Meriem Tazi', position: 'Account Executive', department: 'Commercial', startDate: '22 Sep 2026', stage: 'Manager Approval', assignee: 'Maya El Amrani', progress: 38, status: 'At risk' },
  { id: 'OB-2026-0010', employee: 'Yassine Fathi', position: 'Data Analyst', department: 'Finance', startDate: '01 Oct 2026', stage: 'HR Validation', assignee: 'Saad ES-SAFRYOUY', progress: 20, status: 'On track' },
  { id: 'OB-2026-0009', employee: 'Salma Naciri', position: 'People Partner', department: 'People & Culture', startDate: '01 Sep 2026', stage: 'Completed', assignee: 'Saad ES-SAFRYOUY', progress: 100, status: 'Completed' },
]
export const offboardingRequests: OffboardingRequest[] = [
  { id: 'OFF-2026-0008', employee: 'Karim Amrani', exitDate: '18 Sep 2026', reason: 'Resignation', replacement: 'Youssef Alaoui', stage: 'Equipment Recovery', progress: 72, status: 'At risk' },
  { id: 'OFF-2026-0007', employee: 'Nour El Houda', exitDate: '30 Sep 2026', reason: 'End of contract', replacement: 'To be confirmed', stage: 'Manager', progress: 32, status: 'On track' },
  { id: 'OFF-2026-0006', employee: 'Hamza Ouali', exitDate: '02 Sep 2026', reason: 'Resignation', replacement: 'None', stage: 'Completed', progress: 100, status: 'Completed' },
]
export const leaveTypes: LeaveType[] = [
  { id: 'annual', name: 'Annual leave', color: '#3b82f6', balance: 25, used: 7 },
  { id: 'sick', name: 'Sick leave', color: '#f59e0b', balance: 12, used: 3 },
  { id: 'unpaid', name: 'Unpaid leave', color: '#a78bfa', balance: 30, used: 0 },
]
export const leaveRequests: LeaveRequest[] = [
  { id: 'LV-391', employee: 'Sara El Idrissi', type: 'Annual leave', start: '09 Sep 2026', end: '12 Sep 2026', duration: 4, backup: 'Othmane Berrada', status: 'Approved' },
  { id: 'LV-390', employee: 'Meriem Tazi', type: 'Annual leave', start: '21 Sep 2026', end: '23 Sep 2026', duration: 3, backup: 'Yassine Fathi', status: 'Pending' },
  { id: 'LV-389', employee: 'Lina Chakir', type: 'Sick leave', start: '07 Sep 2026', end: '08 Sep 2026', duration: 2, backup: 'Omar Bennani', status: 'Pending' },
]
export const holidays: Holiday[] = [
  { id: 'h1', name: 'Prophet Birthday', date: '26 Aug 2026', days: 1, recurring: true, type: 'Public' },
  { id: 'h2', name: 'Green March Day', date: '06 Nov 2026', days: 1, recurring: true, type: 'Public' },
  { id: 'h3', name: 'Intillj Agency Day', date: '14 Dec 2026', days: 1, recurring: true, type: 'Company' },
]
export const notifications: Notification[] = [
  { id: 'n1', title: 'Passport expires in 30 days', detail: 'Ahmed Benali · Documents', time: '12 min ago', unread: true, type: 'warning' },
  { id: 'n2', title: 'New onboarding task assigned', detail: 'OB-2026-0012 · ISD', time: '1 hour ago', unread: true, type: 'info' },
  { id: 'n3', title: 'Leave request approved', detail: 'Sara El Idrissi · 4 days', time: 'Yesterday', unread: false, type: 'success' },
]