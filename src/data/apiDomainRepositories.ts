import { apiData, apiRequest } from '../lib/apiClient'
import type { Holiday, LeaveRequest } from '../types/models'
import type { MockRepository, RepositoryPage, RepositoryQuery } from './mockRepository'

export const apiLeaveRepository: MockRepository<LeaveRequest> = {
  async list(query: RepositoryQuery<LeaveRequest> = {}): Promise<RepositoryPage<LeaveRequest>> {
    const params = new URLSearchParams()
    params.set('page', String(query.page ?? 1))
    params.set('pageSize', String(query.pageSize ?? 25))
    if (query.where?.status) params.set('status', String(query.where.status))
    if (query.where?.userId) params.set('employeeId', String(query.where.userId))

    const response = await apiRequest<{ data: any[]; page: number; pageSize: number; total: number }>(`/api/v1/leave-requests?${params}`)
    const data: LeaveRequest[] = response.data.map((item) => ({
      id: item.id,
      userId: item.employee_id ?? item.employee?.id ?? 0,
      employee: item.employee ? `${item.employee.firstName} ${item.employee.lastName}` : '',
      typeId: item.leave_type_id ?? '',
      type: item.leave_type_id ?? '',
      start: item.start_date,
      end: item.end_date,
      fromHalf: item.from_half ?? 'full',
      toHalf: item.to_half ?? 'full',
      duration: Number(item.duration),
      backup: item.backup_employee ? `${item.backup_employee.firstName} ${item.backup_employee.lastName}` : '',
      backupUserId: item.backup_employee_id ?? null,
      note: item.note ?? '',
      status: item.status,
      submittedAt: item.submitted_at,
    }))
    return { data, page: response.page, pageSize: response.pageSize, total: response.total }
  },
  async get(id) {
    const res = await apiData<any>(`/api/v1/leave-requests/${id}`)
    return res ? {
      id: res.id,
      userId: res.employee_id ?? 0,
      employee: '',
      typeId: res.leave_type_id ?? '',
      type: '',
      start: res.start_date,
      end: res.end_date,
      fromHalf: res.from_half ?? 'full',
      toHalf: res.to_half ?? 'full',
      duration: Number(res.duration),
      backup: '',
      backupUserId: res.backup_employee_id ?? null,
      note: res.note ?? '',
      status: res.status,
      submittedAt: res.submitted_at,
    } : null
  },
  async create(input) {
    const res = await apiData<any>('/api/v1/leave-requests', {
      method: 'POST',
      body: JSON.stringify({
        employee_id: input.userId,
        leave_type_id: input.typeId,
        start_date: input.start,
        end_date: input.end,
        from_half: input.fromHalf,
        to_half: input.toHalf,
        duration: input.duration,
        backup_employee_id: input.backupUserId,
        note: input.note,
      }),
    })
    return {
      id: res.id,
      userId: res.employee_id ?? input.userId,
      employee: input.employee,
      typeId: res.leave_type_id ?? input.typeId,
      type: input.type,
      start: res.start_date,
      end: res.end_date,
      fromHalf: res.from_half ?? 'full',
      toHalf: res.to_half ?? 'full',
      duration: Number(res.duration),
      backup: input.backup,
      backupUserId: res.backup_employee_id ?? null,
      note: res.note ?? '',
      status: res.status,
      submittedAt: res.submitted_at,
    }
  },
  async update(id, updates) {
    if (updates.status) {
      const res = await apiData<any>(`/api/v1/leave-requests/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: updates.status }),
      })
      return {
        id: res.id,
        userId: res.employee_id ?? 0,
        employee: '',
        typeId: res.leave_type_id ?? '',
        type: '',
        start: res.start_date,
        end: res.end_date,
        fromHalf: res.from_half ?? 'full',
        toHalf: res.to_half ?? 'full',
        duration: Number(res.duration),
        backup: '',
        backupUserId: res.backup_employee_id ?? null,
        note: res.note ?? '',
        status: res.status,
        submittedAt: res.submitted_at,
      }
    }
    return null
  },
  async delete(id) {
    await apiRequest<void>(`/api/v1/leave-requests/${id}`, { method: 'DELETE' })
    return true
  },
}

export const apiHolidayRepository: MockRepository<Holiday> = {
  async list(): Promise<RepositoryPage<Holiday>> {
    const response = await apiData<any[]>('/api/v1/holidays')
    const data: Holiday[] = response.map((item) => ({
      id: item.id,
      name: item.name,
      nameKey: item.name_key ?? undefined,
      date: item.date,
      days: item.days,
      recurring: item.recurring,
      type: item.type,
      country: item.country ?? null,
      site: item.site ?? null,
    }))
    return { data, page: 1, pageSize: data.length, total: data.length }
  },
  async get(id) {
    const list = await this.list()
    return list.data.find((h) => h.id === id) ?? null
  },
  async create(input) {
    const res = await apiData<any>('/api/v1/holidays', {
      method: 'POST',
      body: JSON.stringify({
        name: input.name,
        name_key: input.nameKey,
        date: input.date,
        days: input.days,
        recurring: input.recurring,
        type: input.type,
        country: input.country,
        site: input.site,
      }),
    })
    return {
      id: res.id,
      name: res.name,
      nameKey: res.name_key ?? undefined,
      date: res.date,
      days: res.days,
      recurring: res.recurring,
      type: res.type,
      country: res.country ?? null,
      site: res.site ?? null,
    }
  },
  async update() { return null },
  async delete() { return true },
}
