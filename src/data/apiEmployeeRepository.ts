import type { Employee } from '../types/models'
import { apiData, apiRequest } from '../lib/apiClient'
import type { MockRepository, RepositoryPage, RepositoryQuery } from './mockRepository'

interface ApiEmployee {
  id: number
  firstName: string
  lastName: string
  jobTitle: string
  departmentId?: string | null
  department?: string | null
  teamId?: string | null
  positionId?: string | null
  managerId?: number | null
  manager?: string | null
  employmentType?: Employee['employmentType'] | null
  status: Employee['status']
  location?: string | null
  country?: string | null
  joined?: string | null
  email?: string | null
  userId?: string | null
  gender?: Employee['gender'] | null
  maritalStatus?: Employee['maritalStatus'] | null
  numberOfChildren?: number | null
  nationalId?: string | null
  nationalityId?: number | null
  passportNumber?: string | null
  passportValidityDate?: string | null
  personalPhone?: string | null
  professionalPhone?: string | null
  personalInfoCompletedAt?: string | null
  personalInfoDismissedUntil?: string | null
  emergencyContactName?: string | null
  emergencyContactPhone?: string | null
  emergencyContactRelationship?: string | null
}

interface ApiEmployeePage {
  data: ApiEmployee[]
  page: number
  pageSize: number
  total: number
}

function toEmployee(source: ApiEmployee): Employee {
  return {
    id: source.id,
    departmentId: source.departmentId ?? null,
    teamId: source.teamId ?? null,
    positionId: source.positionId ?? null,
    managerId: source.managerId ?? null,
    firstName: source.firstName,
    lastName: source.lastName,
    jobTitle: source.jobTitle,
    department: source.department ?? '',
    manager: source.manager ?? '',
    employmentType: source.employmentType ?? null,
    status: source.status,
    location: source.location ?? '',
    country: source.country ?? '',
    joined: source.joined ?? '',
    email: source.email ?? '',
    initials: `${source.firstName[0] ?? ''}${source.lastName[0] ?? ''}`.toUpperCase(),
    userId: 0,
    authUserId: source.userId ?? null,
    gender: source.gender ?? null,
    maritalStatus: source.maritalStatus ?? null,
    numberOfChildren: source.numberOfChildren ?? null,
    nationalId: source.nationalId ?? null,
    nationalityId: source.nationalityId ?? null,
    passportNumber: source.passportNumber ?? null,
    passportValidityDate: source.passportValidityDate ?? null,
    personalPhone: source.personalPhone ?? null,
    professionalPhone: source.professionalPhone ?? null,
    personalInfoCompletedAt: source.personalInfoCompletedAt ?? null,
    personalInfoDismissedUntil: source.personalInfoDismissedUntil ?? null,
    emergencyContactName: source.emergencyContactName ?? null,
    emergencyContactPhone: source.emergencyContactPhone ?? null,
    emergencyContactRelationship: source.emergencyContactRelationship ?? null,
  }
}

function employeePayload(employee: Partial<Employee>): Record<string, unknown> {
  const fields: Partial<Record<keyof Employee, string>> = {
    firstName: 'first_name',
    lastName: 'last_name',
    jobTitle: 'job_title',
    departmentId: 'department_id',
    teamId: 'team_id',
    positionId: 'position_id',
    employmentType: 'employment_type',
    status: 'status',
    location: 'location',
    country: 'country',
    joined: 'joined_at',
    email: 'email',
    gender: 'gender',
    maritalStatus: 'marital_status',
    numberOfChildren: 'number_of_children',
    nationalId: 'national_id',
    nationalityId: 'nationality_id',
    passportNumber: 'passport_number',
    passportValidityDate: 'passport_validity_date',
    personalPhone: 'personal_phone',
    professionalPhone: 'professional_phone',
    personalInfoCompletedAt: 'personal_info_completed_at',
    personalInfoDismissedUntil: 'personal_info_dismissed_until',
    emergencyContactName: 'emergency_contact_name',
    emergencyContactPhone: 'emergency_contact_phone',
    emergencyContactRelationship: 'emergency_contact_relationship',
  }
  return Object.fromEntries(
    Object.entries(employee)
      .filter(([key]) => key in fields)
      .map(([key, value]) => [fields[key as keyof Employee], value]),
  )
}

const apiEmployeeRepository: MockRepository<Employee> = {
  async list(query: RepositoryQuery<Employee> = {}): Promise<RepositoryPage<Employee>> {
    const params = new URLSearchParams()
    params.set('page', String(query.page ?? 1))
    params.set('pageSize', String(query.pageSize ?? 25))
    if (query.search?.trim()) params.set('q', query.search.trim())
    if (query.where?.status) params.set('status', String(query.where.status))
    if (query.sortBy) {
      const apiSort: Partial<Record<keyof Employee, string>> = {
        id: 'id',
        firstName: 'first_name',
        lastName: 'last_name',
        jobTitle: 'job_title',
        status: 'status',
        joined: 'joined_at',
      }
      const sort = apiSort[query.sortBy]
      if (sort) params.set('sort', sort)
    }
    if (query.sortDirection) params.set('order', query.sortDirection)

    const response = await apiRequest<ApiEmployeePage>(`/api/v1/employees?${params}`)
    return {
      data: response.data.map(toEmployee),
      page: response.page,
      pageSize: response.pageSize,
      total: response.total,
    }
  },
  async get(id) {
    const employee = await apiData<ApiEmployee>(`/api/v1/employees/${id}`)
    return toEmployee(employee)
  },
  async create(input) {
    const employee = await apiData<ApiEmployee>('/api/v1/employees', {
      method: 'POST',
      body: JSON.stringify(employeePayload(input)),
    })
    return toEmployee(employee)
  },
  async update(id, updates) {
    const employee = await apiData<ApiEmployee>(`/api/v1/employees/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(employeePayload(updates)),
    })
    return toEmployee(employee)
  },
  async delete(id) {
    await apiRequest<void>(`/api/v1/employees/${id}`, { method: 'DELETE' })
    return true
  },
}

export { apiEmployeeRepository }
