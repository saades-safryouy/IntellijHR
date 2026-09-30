import type { Employee, Holiday } from '../types/models'
import { isSameDay, parseDate, toISODate } from './dates'

export function holidayOccurrenceInYear(holiday: Holiday, year: number): Holiday {
  const date = parseDate(holiday.date)
  if (!date) return holiday
  if (!holiday.recurring) return holiday
  return {
    ...holiday,
    date: toISODate(new Date(year, date.getMonth(), date.getDate())),
  }
}

export function holidaysForYear(holidays: Holiday[], year: number): Holiday[] {
  return holidays.map((holiday) => holidayOccurrenceInYear(holiday, year))
}

export function holidayAppliesToEmployee(holiday: Holiday, employee: Employee): boolean {
  if (holiday.country && holiday.country !== employee.country) return false
  if (holiday.site && holiday.site !== employee.location) return false
  return true
}

export function isHolidayDate(date: Date, holidays: Holiday[], employee?: Employee): boolean {
  return holidays.some((holiday) => {
    if (employee && !holidayAppliesToEmployee(holiday, employee)) return false
    const start = parseDate(holiday.date)
    if (!start) return false
    for (let i = 0; i < Math.max(1, holiday.days); i += 1) {
      const cursor = new Date(start)
      cursor.setDate(start.getDate() + i)
      if (isSameDay(cursor, date)) return true
    }
    return false
  })
}

export function uniqueYears(holidays: Holiday[], extra = new Date().getFullYear()): number[] {
  const years = new Set<number>([extra])
  holidays.forEach((holiday) => {
    const date = parseDate(holiday.date)
    if (date) years.add(date.getFullYear())
    if (holiday.recurring) {
      years.add(extra)
      years.add(extra + 1)
    }
  })
  return [...years].sort((a, b) => a - b)
}
