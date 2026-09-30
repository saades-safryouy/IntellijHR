import type { Employee, EmployeeLeaveEntitlement, HalfDay, Holiday, LeaveRequest, LeaveType } from '../types/models'
import { eachDate, isWeekend, parseDate } from './dates'
import { holidayAppliesToEmployee, holidaysForYear, isHolidayDate } from './holidays'

export interface LeaveBalance {
  type: LeaveType
  entitlement: number
  used: number
  pending: number
  remaining: number
}

function halfAdjustment(fromHalf: HalfDay, toHalf: HalfDay, start: Date, end: Date): number {
  if (start.getTime() === end.getTime()) {
    if (fromHalf === 'AM' || fromHalf === 'PM' || toHalf === 'AM' || toHalf === 'PM') return 0.5
    return 1
  }
  let days = 0
  if (fromHalf === 'PM') days -= 0.5
  if (toHalf === 'AM') days -= 0.5
  return days
}

export function workingLeaveDays(
  startStr: string,
  endStr: string,
  holidays: Holiday[],
  employee: Employee,
  fromHalf: HalfDay = 'full',
  toHalf: HalfDay = 'full',
): number {
  const start = parseDate(startStr)
  const end = parseDate(endStr)
  if (!start || !end || start.getTime() > end.getTime()) return 0

  const years = new Set<number>([start.getFullYear(), end.getFullYear()])
  const scoped = [...years].flatMap((year) =>
    holidaysForYear(holidays, year).filter((holiday) => holidayAppliesToEmployee(holiday, employee)),
  )

  if (start.getTime() === end.getTime()) {
    if (isWeekend(start) || isHolidayDate(start, scoped, employee)) return 0
    return fromHalf !== 'full' || toHalf !== 'full' ? 0.5 : 1
  }

  let count = 0
  eachDate(start, end).forEach((date) => {
    if (isWeekend(date) || isHolidayDate(date, scoped, employee)) return
    count += 1
  })

  count += halfAdjustment(fromHalf, toHalf, start, end)
  return Math.max(0, count)
}

export function rangesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart.getTime() <= bEnd.getTime() && bStart.getTime() <= aEnd.getTime()
}

export function hasLeaveOverlap(
  requests: LeaveRequest[],
  userId: number,
  startStr: string,
  endStr: string,
  ignoreId?: string,
): boolean {
  const start = parseDate(startStr)
  const end = parseDate(endStr)
  if (!start || !end) return false
  return requests.some((request) => {
    if (request.userId !== userId) return false
    if (request.id === ignoreId) return false
    if (request.status === 'rejected' || request.status === 'cancelled') return false
    const otherStart = parseDate(request.start)
    const otherEnd = parseDate(request.end)
    if (!otherStart || !otherEnd) return false
    return rangesOverlap(start, end, otherStart, otherEnd)
  })
}

export function calculateLeaveBalances(
  userId: number,
  types: LeaveType[],
  entitlements: EmployeeLeaveEntitlement[],
  requests: LeaveRequest[],
): LeaveBalance[] {
  return types.map((type) => {
    const entitlement = entitlements.find((item) => item.userId === userId && item.typeId === type.id)?.entitlement ?? 0
    const mine = requests.filter((request) => request.userId === userId && request.typeId === type.id)
    const used = mine.filter((request) => request.status === 'approved').reduce((sum, request) => sum + request.duration, 0)
    const pending = mine.filter((request) => request.status === 'pending').reduce((sum, request) => sum + request.duration, 0)
    return {
      type,
      entitlement,
      used,
      pending,
      remaining: entitlement - used,
    }
  })
}
