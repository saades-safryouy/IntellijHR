import type { Employee, LeaveRequest, OffboardingRequest, OnboardingRequest } from '../../types/models'

export function calculateDashboardMetrics(
  employees: Employee[],
  onboardingRequests: OnboardingRequest[],
  leaveRequests: LeaveRequest[],
  offboardingRequests: OffboardingRequest[] = [],
) {
  const totalEmployees = employees.length
  const activeEmployees = employees.filter((e) => e.status === 'Active').length
  const onLeaveCount = employees.filter((e) => e.status === 'On Leave').length

  // Active onboarding = requests in progress (not completed)
  const activeOnboarding = onboardingRequests.filter(
    (req) => req.status !== 'Completed' && req.stage !== 'Completed'
  ).length
  const onboardingAtRisk = onboardingRequests.filter(
    (req) => req.status === 'At risk'
  ).length

  const activeOffboarding = offboardingRequests.filter(
    (request) => request.status !== 'Completed',
  ).length
  const offboardingOverdue = offboardingRequests.filter(
    (request) => request.status === 'Overdue',
  ).length

  // Leave pending approvals
  const leavePending = leaveRequests.filter((req) => req.status === 'pending')
    .length

  return {
    totalEmployees,
    activeEmployees,
    onLeaveCount,
    activeOnboarding,
    onboardingAtRisk,
    activeOffboarding,
    offboardingOverdue,
    leavePending,
  }
}

export function generateExportCsv(employees: Employee[]): string {
  const headers = [
    'ID',
    'First Name',
    'Last Name',
    'Job Title',
    'Department',
    'Manager',
    'Employment Type',
    'Status',
    'Location',
    'Country',
    'Email',
  ]

  const rows = employees.map((e) => [
    e.id,
    e.firstName,
    e.lastName,
    e.jobTitle,
    e.department,
    e.manager,
    e.employmentType,
    e.status,
    e.location,
    e.country,
    e.email,
  ])

  return generateCsv(headers, rows)
}

export function generateCsv(headers: string[], rows: Array<Array<string | number | null | undefined>>): string {
  const escapeCell = (value: string | number | null | undefined) =>
    `"${String(value ?? '').replaceAll('"', '""')}"`
  return [headers.map(escapeCell).join(','), ...rows.map((row) => row.map(escapeCell).join(','))].join('\n')
}

export function downloadFile(
  content: string,
  filename: string,
  mimeType: string = 'text/csv'
) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
