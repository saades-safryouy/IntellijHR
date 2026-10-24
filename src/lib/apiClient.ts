export const isApiDataMode = import.meta.env.VITE_DATA_MODE === 'api' || true

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '')

export class ApiError extends Error {
  readonly status: number

  constructor(
    message: string,
    status: number,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

type ApiEnvelope<T> = { data: T }

function csrfToken(): string | undefined {
  const cookie = document.cookie.split('; ').find((value) => value.startsWith('XSRF-TOKEN='))
  return cookie ? decodeURIComponent(cookie.slice('XSRF-TOKEN='.length)) : undefined
}

async function initializeCsrf(): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/sanctum/csrf-cookie`, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) {
    throw new ApiError('Could not initialize the secure session. Try again.', response.status)
  }
}

function errorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== 'object') return fallback
  const body = payload as { message?: unknown; errors?: Record<string, unknown> }
  if (typeof body.message === 'string') return body.message
  const firstError = body.errors ? Object.values(body.errors).flat()[0] : undefined
  return typeof firstError === 'string' ? firstError : fallback
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const method = (options.method || 'GET').toUpperCase()
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')
  if (options.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    await initializeCsrf()
    const token = csrfToken()
    if (token) headers.set('X-XSRF-TOKEN', token)
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    method,
    headers,
    credentials: 'include',
  })
  if (response.status === 204) return undefined as T

  const contentType = response.headers.get('Content-Type') || ''
  const payload: unknown = contentType.includes('application/json')
    ? await response.json()
    : await response.text()
  if (!response.ok) {
    throw new ApiError(errorMessage(payload, `The API request failed (${response.status}).`), response.status)
  }

  return payload as T
}

export async function apiData<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await apiRequest<ApiEnvelope<T>>(path, options)
  return response.data
}
