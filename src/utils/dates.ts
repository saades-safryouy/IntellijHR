export function parseDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr) return null
  const iso = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (iso) {
    return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]))
  }
  const parsed = Date.parse(dateStr)
  if (Number.isNaN(parsed)) return null
  const date = new Date(parsed)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function toISODate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setDate(date.getDate() + days)
  return next
}

export function startOfDay(date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function daysUntil(dateStr: string, from = new Date()): number {
  const target = parseDate(dateStr)
  if (!target) return Number.POSITIVE_INFINITY
  const today = startOfDay(from)
  return Math.round((target.getTime() - today.getTime()) / 86400000)
}

export function formatDate(dateStr: string, language: string = 'en'): string {
  const date = parseDate(dateStr)
  if (!date) return dateStr

  const localeMap: Record<string, string> = {
    en: 'en-GB',
    fr: 'fr-FR',
    ar: 'ar-MA',
  }

  return date.toLocaleDateString(localeMap[language] || 'en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(dateStr: string, language: string = 'en'): string {
  const parsed = Date.parse(dateStr)
  if (Number.isNaN(parsed)) return formatDate(dateStr, language)
  const localeMap: Record<string, string> = {
    en: 'en-GB',
    fr: 'fr-FR',
    ar: 'ar-MA',
  }
  return new Date(parsed).toLocaleString(localeMap[language] || 'en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatWeekday(date: Date, language: string = 'en'): string {
  const localeMap: Record<string, string> = {
    en: 'en-GB',
    fr: 'fr-FR',
    ar: 'ar-MA',
  }
  return date.toLocaleDateString(localeMap[language] || 'en-GB', { weekday: 'short' })
}

export function getWeekDays(from = new Date()): Date[] {
  const day = from.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  const monday = startOfDay(from)
  monday.setDate(from.getDate() + mondayOffset)

  return Array.from({ length: 7 }, (_, index) => {
    const next = new Date(monday)
    next.setDate(monday.getDate() + index)
    return next
  })
}

export function isSameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  )
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}

export function eachDate(start: Date, end: Date): Date[] {
  const dates: Date[] = []
  const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const last = new Date(end.getFullYear(), end.getMonth(), end.getDate())
  while (cursor.getTime() <= last.getTime()) {
    dates.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return dates
}
