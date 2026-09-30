import { useMemo, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import { AppLayout } from './components/layout/AppLayout'
import { EmployeeLayout } from './components/layout/EmployeeLayout'
import { LoginPage } from './pages/auth/LoginPage'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { I18nContext, translations, phraseTranslations } from './contexts/I18nContext'
import type { Language, Theme, TranslationKey } from './contexts/I18nContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { RoleRoute } from './components/auth/RoleRoute'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { PeoplePage } from './pages/people/PeoplePage'
import { OnboardingPage } from './pages/onboarding/OnboardingPage'
import { OffboardingPage } from './pages/offboarding/OffboardingPage'
import { LeavePage } from './pages/leave/LeavePage'
import { HolidaysPage } from './pages/holidays/HolidaysPage'
import { DocumentsPage } from './pages/documents/DocumentsPage'
import { CalendarPage } from './pages/calendar/CalendarPage'
import { ReportsPage } from './pages/reports/ReportsPage'
import { SettingsPage } from './pages/settings/SettingsPage'
import { RecruitmentPage } from './pages/recruitment/RecruitmentPage'
import { AttendancePage } from './pages/attendance/AttendancePage'
import { PerformancePage } from './pages/performance/PerformancePage'
import { TrainingPage } from './pages/training/TrainingPage'
import { PayrollPage } from './pages/payroll/PayrollPage'
import { EmployeeDashboard } from './pages/employee/EmployeeDashboard'
import { EmployeeProfilePage } from './pages/employee/EmployeeProfilePage'
import { EmployeeLeavePage } from './pages/employee/EmployeeLeavePage'
import { EmployeeHolidaysPage } from './pages/employee/EmployeeHolidaysPage'
import { EmployeeDocumentsPage } from './pages/employee/EmployeeDocumentsPage'
import { EmployeeOnboardingPage } from './pages/employee/EmployeeOnboardingPage'
import { EmployeeNotificationsPage } from './pages/employee/EmployeeNotificationsPage'
import './App.css'

function AppContent() {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('Intillegence-theme') as Theme) || 'dark')
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('Intillegence-language') as Language) || 'en')
  const { logout } = useAuth()

  const text = useMemo(
    () => (key: TranslationKey | string) => translations[language][key as TranslationKey] || phraseTranslations[language][key] || key,
    [language],
  )

  const changeTheme = (next: Theme) => {
    setTheme(next)
    localStorage.setItem('Intillegence-theme', next)
  }

  const changeLanguage = (next: Language) => {
    setLanguage(next)
    localStorage.setItem('Intillegence-language', next)
  }

  return (
    <div className={`app ${theme}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <I18nContext.Provider value={{ language, text }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicLanding language={language} onLanguageChange={changeLanguage} onThemeChange={changeTheme} theme={theme} />} />
            <Route path="/login" element={<LoginPage language={language} onLanguageChange={changeLanguage} theme={theme} />} />
            
            {/* HR Routes */}
            <Route path="/app" element={
              <ProtectedRoute>
                <RoleRoute roles={['HR Administrator', 'HR', 'Manager', 'Local IT', 'ISD', 'Department Head']}>
                  <AppLayout language={language} theme={theme} onThemeChange={changeTheme} onLanguageChange={changeLanguage} onLogout={logout} />
                </RoleRoute>
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="employees" element={<PeoplePage />} />
              <Route path="onboarding/requests" element={<OnboardingPage />} />
              <Route path="offboarding/requests" element={<OffboardingPage />} />
              <Route path="leave/requests" element={<LeavePage />} />
              <Route path="holidays" element={<HolidaysPage />} />
              <Route path="documents" element={<DocumentsPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="recruitment" element={<RecruitmentPage />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="performance" element={<PerformancePage />} />
              <Route path="training" element={<TrainingPage />} />
              <Route path="payroll" element={<PayrollPage />} />
            </Route>

            {/* Employee Routes */}
            <Route path="/employee" element={
              <ProtectedRoute>
                <RoleRoute roles={['Employee']}>
                  <EmployeeLayout language={language} theme={theme} onThemeChange={changeTheme} onLanguageChange={changeLanguage} onLogout={logout} />
                </RoleRoute>
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/employee/dashboard" replace />} />
              <Route path="dashboard" element={<EmployeeDashboard />} />
              <Route path="profile" element={<EmployeeProfilePage />} />
              <Route path="leave" element={<EmployeeLeavePage />} />
              <Route path="holidays" element={<EmployeeHolidaysPage />} />
              <Route path="documents" element={<EmployeeDocumentsPage />} />
              <Route path="onboarding" element={<EmployeeOnboardingPage />} />
              <Route path="notifications" element={<EmployeeNotificationsPage />} />
            </Route>

            <Route path="*" element={<PublicLanding language={language} onLanguageChange={changeLanguage} onThemeChange={changeTheme} theme={theme} />} />
          </Routes>
        </BrowserRouter>
      </I18nContext.Provider>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

function PublicLanding({
  language,
  onLanguageChange,
  onThemeChange,
  theme,
}: {
  language: Language
  onLanguageChange: (language: Language) => void
  onThemeChange: (theme: Theme) => void
  theme: Theme
}) {
  const navigate = useNavigate()

  return (
    <LandingPage
      language={language}
      onLanguageChange={onLanguageChange}
      onThemeChange={onThemeChange}
      theme={theme}
      onNavigate={navigate}
    />
  )
}

