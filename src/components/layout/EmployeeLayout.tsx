import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Bell,
  CalendarDays,
  CircleHelp,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Sun,
  User,
  X,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import type { Language, Theme } from '../../contexts/I18nContext'
import { Brand } from './Brand'
import { LanguageSwitch } from './LanguageSwitch'
import { NotificationPanel } from '../notifications/NotificationPanel'
import { employeeDashboardTranslations } from '../../pages/employee/translations'

export function EmployeeLayout({
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
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const t = employeeDashboardTranslations[language]

  const navItems = [
    { label: t.navDashboard, path: '/employee/dashboard', icon: LayoutDashboard },
    { label: t.navProfile, path: '/employee/profile', icon: User },
    { label: t.navLeave, path: '/employee/leave', icon: CalendarDays },
    { label: t.navHolidays, path: '/employee/holidays', icon: CalendarDays },
    { label: t.navDocuments, path: '/employee/documents', icon: FolderOpen },
  ]

  const handleLogout = () => {
    onLogout()
    navigate('/')
  }

  return (
    <div className="app-frame">
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
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

        <div className="workspace-label">{t.employeePortal}</div>

        <nav>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              onClick={() => setMobileOpen(false)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <CircleHelp size={18} />
            <span>{t.help}</span>
          </div>

          <div className="mini-user">
            <div className="avatar">{currentUser?.initials}</div>
            {!collapsed && (
              <div>
                <strong>{currentUser?.name}</strong>
                <span>{currentUser?.title || currentUser?.jobTitle || t.employeePortal}</span>
              </div>
            )}
            <MoreHorizontal size={16} />
          </div>

          <button
            className="sidebar-logout"
            onClick={handleLogout}
            title={collapsed ? t.logout : undefined}
            aria-label={t.logout}
          >
            <LogOut size={17} />
            <span>{t.logout}</span>
          </button>
        </div>
      </aside>

      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}

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
            {collapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
          </button>

          <div className="global-search">
            <Search size={17} />
            <input placeholder={t.search} />
            <kbd>⌘ K</kbd>
          </div>

          <div className="top-actions">
            <LanguageSwitch language={language} onChange={onLanguageChange} />

            <button
              className="theme-toggle"
              onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <div className="notification-wrap">
              <button
                className="icon-button notification-button"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label={t.notifications}
              >
                <Bell size={19} />
                <i>2</i>
              </button>
              {showNotifications && <NotificationPanel />}
            </div>

            <div className="top-user">
              <div className="avatar">{currentUser?.initials}</div>
              <div>
                <strong>{currentUser?.name}</strong>
                <span>{currentUser?.title || currentUser?.jobTitle || t.employeePortal}</span>
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
