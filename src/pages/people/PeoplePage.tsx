import { useEffect, useMemo, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  MoreHorizontal,
  Search,
  Settings,
  X,
} from 'lucide-react'
import { PageHeader } from '../../components/common/PageHeader'
import { Breadcrumb } from '../../components/common/Breadcrumb'
import { StatusBadge } from '../../components/employees/StatusBadge'
import { employees } from '../../data/mock'
import type { Employee, EmployeeStatus } from '../../types/models'
import { employeeRepository } from '../../data/mockRepository'
import { isApiDataMode } from '../../lib/apiClient'
import { translations } from '../../contexts/I18nContext'
import { useI18n } from '../../contexts/I18nContext'

function EmployeeDrawer({
  employee,
  onClose,
}: {
  employee: Employee
  onClose: () => void
}) {
  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside
        className="employee-drawer"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="drawer-header">
          <span>EMPLOYEE PROFILE</span>
          <button className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="profile-heading">
          <div className="avatar profile-avatar">{employee.initials}</div>
          <div>
            <h2>
              {employee.firstName} {employee.lastName}
            </h2>
            <p>{employee.jobTitle}</p>
            <StatusBadge status={employee.status} />
          </div>
        </div>

        <div className="profile-details">
          <div>
            <span>Employee ID</span>
            <strong>EMP-{employee.id}</strong>
          </div>
          <div>
            <span>Department</span>
            <strong>{employee.department}</strong>
          </div>
          <div>
            <span>Manager</span>
            <strong>{employee.manager}</strong>
          </div>
          <div>
            <span>Joined</span>
            <strong>{employee.joined}</strong>
          </div>
          <div>
            <span>Location</span>
            <strong>{employee.location}</strong>
          </div>
          <div>
            <span>Email</span>
            <strong>{employee.email}</strong>
          </div>
        </div>

        <div className="drawer-section-title">Personal Information</div>

        <div className="profile-details">
          <div>
            <span>Gender</span>
            <strong>{employee.gender}</strong>
          </div>
          <div>
            <span>Marital Status</span>
            <strong>{employee.maritalStatus}</strong>
          </div>
          <div>
            <span>Children</span>
            <strong>{employee.numberOfChildren}</strong>
          </div>
          <div>
            <span>National ID</span>
            <strong>{employee.nationalId ?? '—'}</strong>
          </div>
          <div>
            <span>Personal Phone</span>
            <strong>{employee.personalPhone ?? '—'}</strong>
          </div>
          <div>
            <span>Professional Phone</span>
            <strong>{employee.professionalPhone ?? '—'}</strong>
          </div>
          <div>
            <span>Passport Number</span>
            <strong>{employee.passportNumber ?? '—'}</strong>
          </div>
          <div>
            <span>Passport Expiry</span>
            <strong>{employee.passportValidityDate ?? '—'}</strong>
          </div>
        </div>
      </aside>
    </div>
  )
}

export function PeoplePage() {
  const { language } = useI18n()
  const t = translations[language]
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'All' | EmployeeStatus>('All')
  const [selected, setSelected] = useState<Employee | null>(null)
  const [page, setPage] = useState(1)
  const [apiEmployees, setApiEmployees] = useState<Employee[]>([])
  const [apiTotal, setApiTotal] = useState(0)
  const [completedQuery, setCompletedQuery] = useState<string | null>(null)
  const [apiError, setApiError] = useState<{ query: string; message: string } | null>(null)
  const queryKey = `${page}:${status}:${search}`
  const loading = isApiDataMode && completedQuery !== queryKey
  const loadError = apiError?.query === queryKey ? apiError.message : null

  useEffect(() => {
    if (!isApiDataMode) return

    let active = true
    employeeRepository.list({
      page,
      pageSize: 25,
      search,
      sortBy: 'lastName',
      where: status === 'All' ? undefined : { status },
    }).then((result) => {
      if (!active) return
      setApiEmployees(result.data)
      setApiTotal(result.total)
      setApiError((previous) => previous?.query === queryKey ? null : previous)
    }).catch((error: unknown) => {
      if (!active) return
      setApiEmployees([])
      setApiTotal(0)
      setApiError({
        query: queryKey,
        message: error instanceof Error ? error.message : 'Could not load employees.',
      })
    }).finally(() => {
      if (active) setCompletedQuery(queryKey)
    })

    return () => {
      active = false
    }
  }, [queryKey, page, search, status])

  const filtered = useMemo(
    () => isApiDataMode ? apiEmployees : employees.filter(
        (employee) =>
          `${employee.firstName} ${employee.lastName} ${employee.jobTitle} ${employee.department}`
            .toLowerCase()
            .includes(search.toLowerCase()) &&
          (status === 'All' || employee.status === status),
      ),
    [apiEmployees, search, status],
  )

  return (
    <div className="page">
      <Breadcrumb
        items={[
          { label: t.people },
        ]}
      />

      <PageHeader
        eyebrow={isApiDataMode ? `PEOPLE · ${apiTotal} EMPLOYEES` : 'PEOPLE · 248 EMPLOYEES'}
        title={t.directory}
        subtitle="A single source of truth for your workforce."
      >
        <button className="button secondary">
          <FileText size={16} />
          {t.export}
        </button>
      </PageHeader>

      <div className="directory-summary">
        {isApiDataMode ? (
          <>
            <div><span>Matching employees</span><strong>{apiTotal}</strong><small>Secure HR directory</small></div>
            <div><span>Shown on this page</span><strong>{apiEmployees.length}</strong><small>Page {page}</small></div>
            <div><span>On leave today</span><strong>—</strong><small>Metric not available</small></div>
            <div><span>Departments</span><strong>—</strong><small>Metric not available</small></div>
          </>
        ) : (
          <>
            <div>
              <span>Active employees</span>
              <strong>226</strong>
              <small>91.1% of workforce</small>
            </div>
            <div>
              <span>On leave today</span>
              <strong>18</strong>
              <small>7.3% of workforce</small>
            </div>
            <div>
              <span>Departments</span>
              <strong>8</strong>
              <small>Across 4 locations</small>
            </div>
            <div>
              <span>New this month</span>
              <strong>+6</strong>
              <small className="green-text">Ahead of target</small>
            </div>
          </>
        )}
      </div>

      <section className="panel directory-panel">
        <div className="directory-toolbar">
          <div className="table-search">
            <Search size={16} />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              placeholder={t.search}
            />
          </div>

          <select
            value={status}
            onChange={(event) => {
              setPage(1)
              setStatus(event.target.value as 'All' | EmployeeStatus)
            }}
          >
            <option>All</option>
            <option>Active</option>
            <option>On Leave</option>
            <option>Suspended</option>
          </select>

          <button className="filter-button">
            <Settings size={16} />
            Filters
            <span>2</span>
          </button>

          <button className="icon-button">
            <MoreHorizontal size={18} />
          </button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Job title</th>
                <th>Department</th>
                <th>Manager</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isApiDataMode && loading ? (
                <tr><td colSpan={7}>Loading employees…</td></tr>
              ) : loadError ? (
                <tr><td colSpan={7} role="alert">{loadError}</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7}>No employees match these filters.</td></tr>
              ) : filtered.map((employee) => (
                <tr key={employee.id} onClick={() => setSelected(employee)}>
                  <td>
                    <div className="employee-cell">
                      <div className="avatar employee-avatar">
                        {employee.initials}
                      </div>
                      <div>
                        <strong>
                          {employee.firstName} {employee.lastName}
                        </strong>
                        <span>EMP-{employee.id}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    {employee.jobTitle}
                    <small className="type-label">
                      {employee.employmentType}
                    </small>
                  </td>
                  <td>{employee.department}</td>
                  <td>{employee.manager}</td>
                  <td>{employee.location}</td>
                  <td>
                    <StatusBadge status={employee.status} />
                  </td>
                  <td>
                    <button
                      className="icon-button"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <MoreHorizontal size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
            <span>
              {isApiDataMode
                ? `Showing ${apiEmployees.length} of ${apiTotal} employees`
                : `Showing ${filtered.length} of 248 employees`}
          </span>
            {isApiDataMode ? (
              <span>
                Page {page} of {Math.max(1, Math.ceil(apiTotal / 25))}
                <button className="icon-button" disabled={page <= 1} onClick={() => setPage(page - 1)} aria-label="Previous page">
                  <ChevronLeft size={15} />
                </button>
                <button className="icon-button" disabled={page >= Math.ceil(apiTotal / 25)} onClick={() => setPage(page + 1)} aria-label="Next page">
                  <ChevronRight size={15} />
                </button>
              </span>
            ) : (
              <span>
                Page 1 of 25
                <ChevronRight size={15} />
              </span>
            )}
        </div>
      </section>

      {selected && (
        <EmployeeDrawer
          employee={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
