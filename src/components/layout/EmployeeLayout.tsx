import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Bell,
  ChevronRight,
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
import { useAuth } from '../../contexts/AuthContext'
import type { Language, Theme } from '../../contexts/I18nContext'
import { Brand } from './Brand'
import { LanguageSwitch } from './LanguageSwitch'

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

  const navItems = [
    { label: 'Dashboard', path: '/employee/dashboard', icon: '🏠' },
    { label: 'My Profile', path: '/employee/profile', icon: '👤' },
    { label: 'My Leave', path: '/employee/leave', icon: '📅' },
    { label: 'Holidays', path: '/employee/holidays', icon: '🎉' },
    { label: 'My Documents', path: '/employee/documents', icon: '📄' },
  ]

  const handleLogout = () => {
    onLogout()
    navigate('/')
  }

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <Brand theme={theme} />
          <button
            className="sidebar-toggle"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
          >
            {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              <ChevronRight size={16} className="nav-arrow" />
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" onClick={handleLogout}>
            <span className="nav-icon">
              <LogOut size={18} />
            </span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main content */}
      <div className="app-main">
        {/* Header */}
        <header className="app-header">
          <div className="header-left">
            <button
              className="menu-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="header-search">
              <Search size={18} />
              <input type="text" placeholder="Search..." />
            </div>
          </div>

          <div className="header-right">
            {/* Notifications */}
            <div className="header-item">
              <button
                className="icon-button"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Notifications"
              >
                <Bell size={20} />
              </button>
            </div>

            {/* Theme toggle */}
            <div className="header-item">
              <button
                className="icon-button"
                onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            {/* Language switch */}
            <div className="header-item">
              <LanguageSwitch language={language} onChange={onLanguageChange} />
            </div>

            {/* User menu */}
            <div className="header-user">
              <div className="user-avatar">{currentUser?.initials}</div>
              <div className="user-info">
                <div className="user-name">{currentUser?.name}</div>
                <div className="user-role">Employee</div>
              </div>
              <button className="icon-button" aria-label="More options">
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

