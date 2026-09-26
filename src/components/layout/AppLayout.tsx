import { useMemo, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Bell,
  ChevronRight,
  CircleHelp,
  LogOut,
  Menu,
  Moon,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Sun,
  X,
} from 'lucide-react'
import { navItems, futureModules } from '../../data/navigation'
import { employees, currentUser } from '../../data/mock'
import { useI18n, translations } from '../../contexts/I18nContext'
import type { Language, Theme, Translation } from '../../contexts/I18nContext'
import { Brand } from './Brand'
import { LanguageSwitch } from './LanguageSwitch'
import { NotificationPanel } from '../notifications/NotificationPanel'

export function AppLayout({
  language,
  theme,
  onThemeChange,
  onLanguageChange,
  onLogout,
}: {
  language: Language
  theme: Theme
  onThemeChange: (theme: Theme) => void
  onLanguageChange: (language: Language) => void
  onLogout: () => void
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [search, setSearch] = useState('')
  const t = translations[language]
  const { text } = useI18n()
  const navigate = useNavigate()

  const matches = useMemo(
    () =>
      employees
        .filter((employee) =>
          `${employee.firstName} ${employee.lastName} ${employee.jobTitle} ${employee.department}`
            .toLowerCase()
            .includes(search.toLowerCase()),
        )
        .slice(0, 3),
    [search],
  )

  return (
    <div className="app-frame">
      <aside
        className={`sidebar ${collapsed ? 'collapsed' : ''} ${
          mobileOpen ? 'mobile-open' : ''
        }`}
      >
        <div className="brand-wrap">
          <Brand compact={collapsed} theme={theme} />
          <button
            className="icon-button sidebar-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <div className="workspace-label">{text('WORKSPACE')}</div>

        <nav>
          {navItems.map(({ to, label, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              title={
                collapsed
                  ? text(t[label as keyof Translation])
                  : undefined
              }
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={18} />
              <span>{text(t[label as keyof Translation])}</span>
              {badge && <em>{badge}</em>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-group">
          <small>{text('EXTENDED MODULES')}</small>
          {futureModules.map(({ path, title, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={16} />
              <span>{text(title)}</span>
            </NavLink>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <CircleHelp size={18} />
            <span>{text('Help & support')}</span>
          </div>

          <div className="mini-user">
            <div className="avatar">SE</div>
            {!collapsed && (
              <div>
                <strong>{currentUser.name}</strong>
                <span>{currentUser.title}</span>
              </div>
            )}
            <MoreHorizontal size={16} />
          </div>

          <button
            className="sidebar-logout"
            onClick={() => {
              onLogout()
              navigate('/login', { replace: true })
            }}
            title={collapsed ? 'Logout' : undefined}
            aria-label="Logout"
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>

          <div className="ecosystem">
            Intillegence AGENCY
            <span>•</span>
            PLATFORM
          </div>
        </div>
      </aside>

      <main className="main-shell">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>

          <button
            className="icon-button collapse-toggle"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
          >
            {collapsed ? (
              <PanelLeftOpen size={19} />
            ) : (
              <PanelLeftClose size={19} />
            )}
          </button>

          <div className="global-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={text(t.search)}
            />
            <kbd>⌘ K</kbd>

            {search && (
              <div className="search-results">
                {matches.length ? (
                  matches.map((employee) => (
                    <button
                      key={employee.id}
                      onClick={() => {
                        navigate('/app/employees')
                        setSearch('')
                      }}
                    >
                      <div className="avatar">{employee.initials}</div>
                      <span>
                        <strong>
                          {employee.firstName} {employee.lastName}
                        </strong>
                        <small>{employee.jobTitle}</small>
                      </span>
                      <ChevronRight size={15} />
                    </button>
                  ))
                ) : (
                  <span className="no-results">{text('No people found')}</span>
                )}
              </div>
            )}
          </div>

          <div className="top-actions">
            <LanguageSwitch language={language} onChange={onLanguageChange} />

            <button
              className="theme-toggle"
              onClick={() =>
                onThemeChange(theme === 'dark' ? 'light' : 'dark')
              }
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <div className="notification-wrap">
              <button
                className="icon-button notification-button"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label={text('Notifications')}
              >
                <Bell size={19} />
                <i>2</i>
              </button>
              {showNotifications && <NotificationPanel />}
            </div>

            <div className="top-user">
              <div className="avatar">SE</div>
              <div>
                <strong>{currentUser.name}</strong>
                <span>{currentUser.title}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
