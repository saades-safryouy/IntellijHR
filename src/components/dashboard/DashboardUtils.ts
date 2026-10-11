import type { Employee, OnboardingRequest, LeaveRequest } from '../../types/models'

export function calculateDashboardMetrics(
  employees: Employee[],
  onboardingRequests: OnboardingRequest[],
  leaveRequests: LeaveRequest[]
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

  // For demo purposes, assume no active offboarding (would need separate offboarding data)
  const activeOffboarding = 0
  const offboardingOverdue = 0

  // Leave pending approvals
  const leavePending = leaveRequests.filter((req) => req.status === 'pending')
    .length

  // Month-over-month growth (mock calculation for demo)
  const employeeGrowth = ((activeEmployees - Math.floor(activeEmployees * 0.96)) / activeEmployees * 100).toFixed(1)

  return {
    totalEmployees,
    activeEmployees,
    onLeaveCount,
    activeOnboarding,
    onboardingAtRisk,
    activeOffboarding,
    offboardingOverdue,
    leavePending,
    employeeGrowth,
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

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n')

  return csvContent
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


