import { useMemo, useState } from 'react'
import {
  ChevronRight,
  FileText,
  MoreHorizontal,
  Search,
  Settings,
  X,
} from 'lucide-react'
import { PageHeader } from '../../components/common/PageHeader'
import { StatusBadge } from '../../components/employees/StatusBadge'
import { employees } from '../../data/mock'
import type { Employee, EmployeeStatus } from '../../types/models'
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
            <strong>{employee.nationalId}</strong>
          </div>
          <div>
            <span>Personal Phone</span>
            <strong>{employee.personalPhone}</strong>
          </div>
          <div>
            <span>Professional Phone</span>
            <strong>{employee.professionalPhone}</strong>
          </div>
          <div>
            <span>Passport Number</span>
            <strong>{employee.passportNumber ?? '—'}</strong>
          </div>
          <div>
            <span>Passport Expiry</span>
            <strong>{employee.passportValidityDate}</strong>
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

  const filtered = useMemo(
    () =>
      employees.filter(
        (employee) =>
          `${employee.firstName} ${employee.lastName} ${employee.jobTitle} ${employee.department}`
            .toLowerCase()
            .includes(search.toLowerCase()) &&
          (status === 'All' || employee.status === status),
      ),
    [search, status],
  )

  return (
    <div className="page">
      <PageHeader
        eyebrow="PEOPLE · 248 EMPLOYEES"
        title={t.directory}
        subtitle="A single source of truth for your workforce."
      >
        <button className="button secondary">
          <FileText size={16} />
          {t.export}
        </button>
      </PageHeader>

      <div className="directory-summary">
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
      </div>

      <section className="panel directory-panel">
        <div className="directory-toolbar">
          <div className="table-search">
            <Search size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t.search}
            />
          </div>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as 'All' | EmployeeStatus)
            }
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
              {filtered.map((employee) => (
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
          <span>Showing {filtered.length} of 248 employees</span>
          <span>
            Page 1 of 25
            <ChevronRight size={15} />
          </span>
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
