import {
  createEmployee,
  createLeaveRequest,
  createOffboardingTask,
  createOnboardingTask,
  deleteEmployee,
  deleteLeaveRequest,
  deleteOffboardingTask,
  deleteOnboardingTask,
  getEmployeeById,
  getEmployees,
  getLeaveRequests,
  getOffboardingTasks,
  getOnboardingRequests,
  resetDemoData as resetStoredDemoData,
  updateLeaveRequest,
  updateOffboardingTask,
  updateEmployee,
  updateOnboardingTask,
} from './employeeStore'
import type { Department, Employee, LeaveRequest, OffboardingRequest, OnboardingRequest } from '../types/models'
import { isApiDataMode } from '../lib/apiClient'
import { apiEmployeeRepository } from './apiEmployeeRepository'
import { apiLeaveRepository, apiDepartmentRepository } from './apiDomainRepositories'
import { departments } from './mock'

export type RepositoryOperation = 'list' | 'get' | 'create' | 'update' | 'delete'

export interface RepositoryQuery<T> {
  page?: number
  pageSize?: number
  search?: string
  searchFields?: (keyof T)[]
  where?: Partial<Record<keyof T, unknown>>
  sortBy?: keyof T
  sortDirection?: 'asc' | 'desc'
}

export interface RepositoryPage<T> {
  data: T[]
  page: number
  pageSize: number
  total: number
}

export interface MockRepository<T extends { id: string | number }> {
  list(query?: RepositoryQuery<T>): Promise<RepositoryPage<T>>
  get(id: T['id']): Promise<T | null>
  create(input: Omit<T, 'id'>): Promise<T>
  update(id: T['id'], updates: Partial<Omit<T, 'id'>>): Promise<T | null>
  delete(id: T['id']): Promise<boolean>
}

export interface MockRepositoryOptions {
  latencyMs?: number
  failNext?: Partial<Record<RepositoryOperation, string>>
}

export function createMockRepository<T extends { id: string | number }>(
  adapter: {
    read: () => T[]
    get: (id: T['id']) => T | null
    create: (input: Omit<T, 'id'>) => T
    update: (id: T['id'], updates: Partial<Omit<T, 'id'>>) => T | null
    delete: (id: T['id']) => boolean
  },
  options: MockRepositoryOptions = {},
): MockRepository<T> {
  const delay = options.latencyMs ?? 0
  if (!Number.isFinite(delay) || delay < 0) {
    throw new RangeError('Mock repository latency must be a non-negative number.')
  }
  const failures = { ...options.failNext }

  async function run<R>(operation: RepositoryOperation, action: () => R): Promise<R> {
    if (delay > 0) await new Promise<void>((resolve) => globalThis.setTimeout(resolve, delay))
    const failure = failures[operation]
    if (failure) {
      delete failures[operation]
      throw new Error(failure)
    }
    return action()
  }

  return {
    list(query = {}) {
      return run('list', () => {
        const page = query.page ?? 1
        const pageSize = query.pageSize ?? 20
        if (!Number.isInteger(page) || page < 1 || !Number.isInteger(pageSize) || pageSize < 1) {
          throw new RangeError('Page and page size must be positive integers.')
        }

        let records = adapter.read().filter((record) =>
          Object.entries(query.where ?? {}).every(([key, value]) =>
            value === undefined || Object.is(record[key as keyof T], value),
          ),
        )
        const search = query.search?.trim().toLocaleLowerCase()
        if (search) {
          const fields = query.searchFields ?? []
          records = records.filter((record) =>
            fields.some((field) => String(record[field] ?? '').toLocaleLowerCase().includes(search)),
          )
        }
        if (query.sortBy) {
          const direction = query.sortDirection === 'desc' ? -1 : 1
          const sortBy = query.sortBy
          records = records.toSorted((left, right) => {
            const a = left[sortBy]
            const b = right[sortBy]
            const result = typeof a === 'number' && typeof b === 'number'
              ? a - b
              : String(a ?? '').localeCompare(String(b ?? ''), undefined, { numeric: true })
            return result * direction
          })
        }
        const total = records.length
        const start = (page - 1) * pageSize
        return { data: structuredClone(records.slice(start, start + pageSize)), page, pageSize, total }
      })
    },
    get(id) {
      return run('get', () => {
        const record = adapter.get(id)
        return record ? structuredClone(record) : null
      })
    },
    create(input) {
      return run('create', () => structuredClone(adapter.create(input)))
    },
    update(id, updates) {
      return run('update', () => {
        const record = adapter.update(id, updates)
        return record ? structuredClone(record) : null
      })
    },
    delete(id) {
      return run('delete', () => adapter.delete(id))
    },
  }
}

export const employeeRepository: MockRepository<Employee> = isApiDataMode
  ? apiEmployeeRepository
  : createMockRepository<Employee>({
      read: getEmployees,
      get: getEmployeeById,
      create: createEmployee,
      update: updateEmployee,
      delete: deleteEmployee,
    })

export const leaveRequestRepository = isApiDataMode
  ? apiLeaveRepository
  : createMockRepository<LeaveRequest>({
      read: getLeaveRequests,
      get: (id) => getLeaveRequests().find((request) => request.id === id) ?? null,
      create: createLeaveRequest,
      update: updateLeaveRequest,
      delete: deleteLeaveRequest,
    })
export const departmentRepository = isApiDataMode
  ? apiDepartmentRepository
  : createMockRepository<Department>({
      read: () => departments,
      get: (id) => departments.find((d) => d.id === id) ?? null,
      create: (input) => {
        const newDept: Department = { id: String(Date.now()), employeeCount: 0, color: '#3b82f6', head: '', ...input }
        departments.push(newDept)
        return newDept
      },
      update: (id, updates) => {
        const index = departments.findIndex((d) => d.id === id)
        if (index === -1) return null
        departments[index] = { ...departments[index], ...updates }
        return departments[index]
      },
      delete: (id) => {
        const index = departments.findIndex((d) => d.id === id)
        if (index === -1) return false
        departments.splice(index, 1)
        return true
      },
    })

export const onboardingRepository = createMockRepository<OnboardingRequest>({
  read: getOnboardingRequests,
  get: (id) => getOnboardingRequests().find((request) => request.id === id) ?? null,
  create: createOnboardingTask,
  update: updateOnboardingTask,
  delete: deleteOnboardingTask,
})

export const offboardingRepository = createMockRepository<OffboardingRequest>({
  read: getOffboardingTasks,
  get: (id) => getOffboardingTasks().find((request) => request.id === id) ?? null,
  create: createOffboardingTask,
  update: updateOffboardingTask,
  delete: deleteOffboardingTask,
})

export function resetDemoRepositoryData(confirmed: boolean): Promise<void> {
  return Promise.resolve().then(() => resetStoredDemoData(confirmed))
}
