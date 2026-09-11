import {  createContext, useContext, useEffect, useMemo, useState,} from 'react'
import type { FormEvent, ReactNode } from 'react'

import { motion } from 'framer-motion'
import { BrowserRouter, NavLink, Route, Routes, useLocation, useNavigate,} from 'react-router-dom'

import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  FileText,
  FolderOpen,
  Globe2,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  Users,
  X,
  Laptop,
  WalletCards,
  GraduationCap,
  LockKeyhole,
  Eye,
  EyeOff,
} from 'lucide-react'

import {
  departments,
  employees,
  holidays,
  leaveRequests,
  notifications,
  offboardingRequests,
  onboardingRequests,
  currentUser,
} from './data/mock'

import type { Employee, EmployeeStatus } from './types/models'
import { sidebarLabels } from './lib/motion'

import LandingPage from './components/LandingPage'

import './App.css'

import logo from './assets/IAgency_logo.png'
import lightLogo from './assets/IAgency_light_logo.png'


/* =========================================================
   TYPES
========================================================= */

type Language = 'en' | 'fr' | 'ar'
type Theme = 'dark' | 'light'

type Translation = typeof translations.en
type TranslationKey = keyof Translation


/* =========================================================
   TRANSLATIONS
========================================================= */

const translations = {
  en: {
    dashboard: 'Dashboard',
    people: 'People',
    onboarding: 'Onboarding',
    offboarding: 'Offboarding',
    leave: 'Leave management',
    holidays: 'Holidays',
    documents: 'Documents',
    calendar: 'Calendar',
    reports: 'Reports',
    settings: 'Settings',

    directory: 'People directory',
    search: 'Search people, departments, roles...',

    export: 'Export',
    create: 'Create request',

    employees: 'Total employees',
    activeOnboarding: 'Active onboarding',
    activeOffboarding: 'Active offboarding',
    onLeave: 'Employees on leave',

    recent: 'Recent activity',
    upcoming: 'Upcoming events',
  },

  fr: {
    dashboard: 'Tableau de bord',
    people: 'Collaborateurs',
    onboarding: 'Intégration',
    offboarding: 'Départs',
    leave: 'Gestion des congés',
    holidays: 'Jours fériés',
    documents: 'Documents',
    calendar: 'Calendrier',
    reports: 'Rapports',
    settings: 'Paramètres',

    directory: 'Annuaire des collaborateurs',
    search: 'Rechercher...',

    export: 'Exporter',
    create: 'Créer une demande',

    employees: 'Collaborateurs',
    activeOnboarding: 'Intégrations actives',
    activeOffboarding: 'Départs actifs',
    onLeave: 'En congé',

    recent: 'Activité récente',
    upcoming: 'Événements à venir',
  },

  ar: {
    dashboard: 'لوحة التحكم',
    people: 'الموظفون',
    onboarding: 'التهيئة',
    offboarding: 'المغادرة',
    leave: 'إدارة الإجازات',
    holidays: 'العطل',
    documents: 'المستندات',
    calendar: 'التقويم',
    reports: 'التقارير',
    settings: 'الإعدادات',

    directory: 'دليل الموظفين',
    search: 'ابحث عن موظفين أو أقسام...',

    export: 'تصدير',
    create: 'إنشاء طلب',

    employees: 'إجمالي الموظفين',
    activeOnboarding: 'تهيئة نشطة',
    activeOffboarding: 'مغادرة نشطة',
    onLeave: 'في إجازة',

    recent: 'النشاط الأخير',
    upcoming: 'الأحداث القادمة',
  },
}


const phraseTranslations: Record<Language, Record<string, string>> = {
  en: {},

  fr: {
    Features: 'Fonctionnalités',
    Modules: 'Modules',
    Ecosystem: 'Écosystème',
    Security: 'Sécurité',
    'Sign in': 'Se connecter',
    'Get started': 'Commencer',
    'Coming soon': 'Bientôt disponible',
    Notifications: 'Notifications',
    'Mark all read': 'Tout marquer comme lu',
    Filters: 'Filtres',
    Actions: 'Actions',
    Employee: 'Collaborateur',
    'Job title': 'Poste',
    Department: 'Département',
    Manager: 'Responsable',
    Location: 'Lieu',
    Status: 'Statut',
    All: 'Tous',
    Active: 'Actif',
    'On Leave': 'En congé',
    Suspended: 'Suspendu',
    Month: 'Mois',
    Week: 'Semaine',
    Agenda: 'Agenda',
    'Save changes': 'Enregistrer',
  },

  ar: {
    Features: 'الميزات',
    Modules: 'الوحدات',
    Ecosystem: 'المنظومة',
    Security: 'الأمان',
    'Sign in': 'تسجيل الدخول',
    'Get started': 'ابدأ الآن',
    'Coming soon': 'قريباً',
    Notifications: 'الإشعارات',
    'Mark all read': 'تحديد الكل كمقروء',
    Filters: 'الفلاتر',
    Actions: 'الإجراءات',
    Employee: 'الموظف',
    'Job title': 'المسمى الوظيفي',
    Department: 'القسم',
    Manager: 'المسؤول',
    Location: 'الموقع',
    Status: 'الحالة',
    All: 'الكل',
    Active: 'نشط',
    'On Leave': 'في إجازة',
    Suspended: 'موقوف',
    Month: 'شهر',
    Week: 'أسبوع',
    Agenda: 'جدول الأعمال',
    'Save changes': 'حفظ التغييرات',
  },
}


/* =========================================================
   I18N CONTEXT
========================================================= */

const I18nContext = createContext<{
  language: Language
  text: (key: TranslationKey | string) => string
}>({
  language: 'en',
  text: (key) =>
    translations.en[key as TranslationKey] || key,
})


function useI18n() {
  return useContext(I18nContext)
}


/* =========================================================
   NAVIGATION
========================================================= */

const navItems = [
  {
    to: '/app/dashboard',
    label: 'dashboard',
    icon: LayoutDashboard,
  },
  {
    to: '/app/employees',
    label: 'people',
    icon: Users,
    badge: '248',
  },
  {
    to: '/app/onboarding/requests',
    label: 'onboarding',
    icon: ClipboardCheck,
  },
  {
    to: '/app/offboarding/requests',
    label: 'offboarding',
    icon: LogOut,
  },
  {
    to: '/app/leave/requests',
    label: 'leave',
    icon: CalendarDays,
  },
  {
    to: '/app/holidays',
    label: 'holidays',
    icon: CalendarDays,
  },
  {
    to: '/app/documents',
    label: 'documents',
    icon: FolderOpen,
  },
  {
    to: '/app/calendar',
    label: 'calendar',
    icon: CalendarDays,
  },
  {
    to: '/app/reports',
    label: 'reports',
    icon: BarChart3,
  },
  {
    to: '/app/settings',
    label: 'settings',
    icon: Settings,
  },
]


const futureModules = [
  {
    path: '/app/recruitment',
    title: 'Recruitment',
    detail:
      'Connect future hiring workflows directly to onboarding.',
    icon: BriefcaseBusiness,
  },
  {
    path: '/app/attendance',
    title: 'Attendance',
    detail:
      'Time and attendance insights are being prepared for the next release.',
    icon: Clock3,
  },
  {
    path: '/app/performance',
    title: 'Performance',
    detail:
      'Build a continuous performance culture with a connected people layer.',
    icon: BarChart3,
  },
  {
    path: '/app/training',
    title: 'Training & Development',
    detail:
      'Learning journeys and skills intelligence will arrive here.',
    icon: GraduationCap,
  },
  {
    path: '/app/payroll',
    title: 'Payroll & Compensation',
    detail:
      'Compensation intelligence will connect to the employee profile.',
    icon: WalletCards,
  },
]


/* =========================================================
   APP
========================================================= */

function App() {
  const [theme, setTheme] = useState<Theme>(
    () =>
      (localStorage.getItem('Intillegence-theme') as Theme) ||
      'dark',
  )

  const [language, setLanguage] = useState<Language>(
    () =>
      (localStorage.getItem('Intillegence-language') as Language) ||
      'en',
  )

  const changeTheme = (next: Theme) => {
    setTheme(next)
    localStorage.setItem('Intillegence-theme', next)
  }

  const changeLanguage = (next: Language) => {
    setLanguage(next)
    localStorage.setItem('Intillegence-language', next)
  }

  const text = (key: TranslationKey | string) =>
    translations[language][key as TranslationKey] ||
    phraseTranslations[language][key] ||
    key

  return (
    <div
      className={`app ${theme}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <I18nContext.Provider value={{ language, text }}>
        <BrowserRouter>
          <Routes>

            {/* Public landing page */}
            <Route
              path="/"
              element={
                <PublicLanding
                  language={language}
                  onLanguageChange={changeLanguage}
                  onThemeChange={changeTheme}
                  theme={theme}
                />
              }
            />

            {/* Login */}
            <Route
              path="/login"
              element={
                <Login
                  language={language}
                  onLanguageChange={changeLanguage}
                  theme={theme}
                />
              }
            />

            {/* Application */}
            <Route
              path="/app/*"
              element={
                <AppLayout
                  language={language}
                  theme={theme}
                  onThemeChange={changeTheme}
                  onLanguageChange={changeLanguage}
                />
              }
            />

            {/* Fallback */}
            <Route
              path="*"
              element={
                <Home
                  language={language}
                  onLanguageChange={changeLanguage}
                  onThemeChange={changeTheme}
                  theme={theme}
                />
              }
            />

          </Routes>
        </BrowserRouter>
      </I18nContext.Provider>
    </div>
  )
}


/* =========================================================
   PUBLIC LANDING
========================================================= */

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


/* =========================================================
   BRAND
========================================================= */

function Brand({
  compact = false,
  theme,
}: {
  compact?: boolean
  theme: Theme
}) {
  return (
    <div className="brand">

      <div className="brand-mark">
        <img
          src={theme === 'light' ? logo : lightLogo}
          alt="IntillegenceHR"
        />
      </div>

      {!compact && (
        <div>
          <strong>
            Intillgence<span>HR</span>
          </strong>

          <small>
            INTILLIGENCE AGENCY
          </small>
        </div>
      )}

    </div>
  )
}


/* =========================================================
   LANGUAGE SWITCHER
========================================================= */

function LanguageSwitch({
  language,
  onChange,
}: {
  language: Language
  onChange: (language: Language) => void
}) {
  return (
    <div className="language-switcher">

      <button
        className={language === 'en' ? 'active' : ''}
        onClick={() => onChange('en')}
      >
        EN
      </button>

      <button
        className={language === 'fr' ? 'active' : ''}
        onClick={() => onChange('fr')}
      >
        FR
      </button>

      <button
        className={language === 'ar' ? 'active' : ''}
        onClick={() => onChange('ar')}
      >
        ع
      </button>

    </div>
  )
}


/* =========================================================
   HOME
========================================================= */

function Home({
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
  const { text } = useI18n()

  return (
    <div className="marketing">

      <header className="marketing-nav">

        <Brand theme={theme} />

        <nav>
          <a href="#features">
            {text('Features')}
          </a>

          <a href="#modules">
            {text('Modules')}
          </a>

          <a href="#ecosystem">
            {text('Ecosystem')}
          </a>

          <a href="#security">
            {text('Security')}
          </a>
        </nav>

        <div className="marketing-actions">

          <LanguageSwitch
            language={language}
            onChange={onLanguageChange}
          />

          <button
            className="theme-toggle"
            onClick={() =>
              onThemeChange(
                theme === 'dark' ? 'light' : 'dark',
              )
            }
            aria-label={text('Appearance')}
          >
            {theme === 'dark' ? (
              <Sun size={17} />
            ) : (
              <Moon size={17} />
            )}
          </button>

          <button
            className="button ghost"
            onClick={() => navigate('/login')}
          >
            {text('Sign in')}
          </button>

          <button
            className="button primary"
            onClick={() => navigate('/login')}
          >
            {text('Get started')}
            <ArrowRight size={15} />
          </button>

        </div>
      </header>


      <main>

        {/* HERO */}

        <section className="hero">

          <div className="hero-copy">

            <span className="hero-kicker">
              <Sparkles size={14} />
              Intillegence AGENCY · PEOPLE OPERATIONS
            </span>

            <h1>
              Smarter people management.
              <br />
              <em>Stronger organizations.</em>
            </h1>

            <p>
              IntillegenceHR brings your people, workflows,
              leave management and employee lifecycle
              into one intelligent HR platform.
            </p>

            <div className="hero-buttons">

              <button
                className="button primary large"
                onClick={() => navigate('/login')}
              >
                Explore IntillegenceHR
                <ArrowRight size={17} />
              </button>

              <button
                className="button ghost large"
                onClick={() => navigate('/login')}
              >
                Sign in
              </button>

            </div>

            <div className="hero-trust">
              <ShieldCheck size={17} />
              <span>Secure by design</span>

              <span className="trust-dot" />

              <span>Multi-company ready</span>
            </div>

          </div>

          <ProductPreview />

        </section>


        {/* FEATURES */}

        <section
          className="section"
          id="features"
        >

          <SectionIntro
            eyebrow="A CLEARER WAY TO WORK"
            title="The people layer your organization has been missing."
            text="A calm, connected workspace for the work behind every great team."
          />

          <div className="feature-grid">

            {[
              'Centralized people data',
              'Automated HR workflows',
              'Employee self-service',
              'Powerful analytics',
              'Secure & auditable',
              'Multi-company ready',
            ].map((item, index) => (

              <div
                className="feature-card"
                key={item}
              >

                <div className="feature-number">
                  0{index + 1}
                </div>

                <h3>
                  {item}
                </h3>

                <p>
                  {
                    [
                      'One reliable profile for every employee, role and document.',
                      'Guide onboarding, leave and offboarding with less chasing.',
                      'Give employees clear access to the tasks and answers they need.',
                      'Turn workforce signals into decisions your leaders can trust.',
                      'Role-based access and audit trails for sensitive people data.',
                      'Designed for the growing IntillegenceAgency operating model.',
                    ][index]
                  }
                </p>

              </div>

            ))}

          </div>

        </section>


        {/* LIFECYCLE */}

        <section className="lifecycle-section">

          <div className="section-heading">

            <span className="eyebrow">
              THE HR LIFECYCLE
            </span>

            <h2>
              From first day to next chapter.
            </h2>

          </div>

          <div className="lifecycle">

            {[
              'Hire',
              'Onboard',
              'Employee',
              'Leave',
              'Develop',
              'Offboard',
            ].map((step, index) => (

              <div
                className="lifecycle-step"
                key={step}
              >

                <div className="lifecycle-marker">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <strong>
                  {step}
                </strong>

                {index < 5 && (
                  <ArrowRight size={15} />
                )}

              </div>

            ))}

          </div>

        </section>


        {/* MODULES */}

        <section
          className="section"
          id="modules"
        >

          <SectionIntro
            eyebrow="ONE PLATFORM, FOCUSED MODULES"
            title="Everything your HR team needs now."
            text="Start with the operational essentials. Add more intelligence as your organization grows."
          />

          <div className="module-tiles">

            {[
              {
                name: 'People',
                detail: 'Profiles & directory',
                icon: Users,
              },
              {
                name: 'Onboarding',
                detail: 'Requests & checklists',
                icon: ClipboardCheck,
              },
              {
                name: 'Offboarding',
                detail: 'Exit workflows',
                icon: LogOut,
              },
              {
                name: 'Leave',
                detail: 'Requests & approvals',
                icon: CalendarDays,
              },
              {
                name: 'Holidays',
                detail: 'Company calendar',
                icon: CalendarDays,
              },
              {
                name: 'Documents',
                detail: 'Employee records',
                icon: FolderOpen,
              },
              {
                name: 'Reports',
                detail: 'Workforce insights',
                icon: BarChart3,
              },
            ].map(
              ({
                name,
                detail,
                icon: Icon,
              }) => (

                <div
                  className="module-tile"
                  key={name}
                >

                  <Icon size={21} />

                  <div>
                    <strong>{name}</strong>
                    <span>{detail}</span>
                  </div>

                  <ChevronRight size={16} />

                </div>

              ),
            )}

          </div>

        </section>


        {/* ECOSYSTEM */}

        <section
          className="ecosystem-section"
          id="ecosystem"
        >

          <div>

            <span className="eyebrow">
              THE Intillegence AGENCY ECOSYSTEM
            </span>

            <h2>
              A connected operating system
              for ambitious teams.
            </h2>

            <p>
              IntillegenceHR is the people foundation
              for a broader suite of business tools,
              designed to share context without
              creating noise.
            </p>

          </div>

          <div className="ecosystem-tree">

            <div className="tree-root">
              Intillegence AGENCY
            </div>

            {[
              'IntillegenceHR',
              'IntillegenceFinance',
              'IntillegenceCRM',
              'IntillegenceOperations',
            ].map((name, index) => (

              <div
                className="tree-branch"
                key={name}
              >

                <span />

                <strong>
                  {name}
                </strong>

                {index > 0 && (
                  <small>
                    Coming soon
                  </small>
                )}

              </div>

            ))}

          </div>

        </section>


        {/* SECURITY */}

        <section
          className="security-section"
          id="security"
        >

          <div className="security-icon">
            <ShieldCheck size={26} />
          </div>

          <div>

            <span className="eyebrow">
              TRUST IS A FEATURE
            </span>

            <h2>
              Built for sensitive work.
            </h2>

            <p>
              Role-based access, audit trails,
              privacy-minded workflows and secure
              authentication keep your people data
              in the right hands.
            </p>

          </div>

          <div className="security-list">

            <span>
              <Check size={15} />
              Role-based access
            </span>

            <span>
              <Check size={15} />
              Audit trail
            </span>

            <span>
              <Check size={15} />
              Data privacy
            </span>

          </div>

        </section>


        {/* CTA */}

        <section className="cta-section">

          <span className="eyebrow">
            READY WHEN YOU ARE
          </span>

          <h2>
            Build a stronger organization
            with IntillegenceHR.
          </h2>

          <button
            className="button primary large"
            onClick={() => navigate('/login')}
          >
            Access IntillegenceHR
            <ArrowRight size={17} />
          </button>

        </section>

      </main>


      {/* FOOTER */}

      <footer className="marketing-footer">

        <Brand theme={theme} />

        <div>
          <span>Product</span>
          <span>Solutions</span>
          <span>Security</span>
          <span>Documentation</span>
          <span>Contact</span>
        </div>

        <small>
          © 2026 IntillegenceAgency
        </small>

      </footer>

    </div>
  )
}


/* =========================================================
   PRODUCT PREVIEW
========================================================= */

function ProductPreview() {
  return (
    <div className="product-preview">

      <div className="preview-top">

        <span />
        <span />
        <span />

        <small>
          IntillegenceHR workspace
        </small>

      </div>


      <div className="preview-body">

        <aside>

          <div className="preview-logo">
            I
          </div>

          <i />
          <i />
          <i />
          <i />
          <i />

        </aside>


        <div className="preview-main">

          <div className="preview-title">

            <div>

              <small>
                MONDAY, 08 SEPTEMBER 2026
              </small>

              <strong>
                Good morning, Saad
              </strong>

            </div>

            <div className="preview-avatar">
              SE
            </div>

          </div>


          <div className="preview-kpis">

            <span>
              <small>People</small>
              <strong>248</strong>
              <em>+4.2%</em>
            </span>

            <span>
              <small>Onboarding</small>
              <strong>12</strong>
              <em>3 need attention</em>
            </span>

            <span>
              <small>On leave</small>
              <strong>18</strong>
              <em>This week</em>
            </span>

          </div>


          <div className="preview-chart">

            <div className="fake-bars">

              {[42, 59, 50, 76, 61, 84, 71].map(
                (height, index) => (
                  <i
                    style={{
                      height: `${height}%`,
                    }}
                    key={index}
                  />
                ),
              )}

            </div>

            <div className="fake-chart-label">

              Workforce overview

              <small>
                Headcount by department
              </small>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}


/* =========================================================
   SECTION INTRO
========================================================= */

function SectionIntro({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string
  title: string
  text: string
}) {
  return (
    <div className="section-heading">

      <span className="eyebrow">
        {eyebrow}
      </span>

      <h2>
        {title}
      </h2>

      <p>
        {text}
      </p>

    </div>
  )
}


/* =========================================================
   LOGIN
========================================================= */

function Login({
  language,
  onLanguageChange,
  theme,
}: {
  language: Language
  onLanguageChange: (language: Language) => void
  theme: Theme
}) {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] =
    useState(false)

  const [loading, setLoading] =
    useState(false)


  const submit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    setLoading(true)

    window.setTimeout(() => {
      setLoading(false)
      navigate('/app/dashboard')
    }, 500)
  }


  return (
    <div className="login-page">

      {/* LEFT VISUAL */}

      <div className="login-visual">

        <div className="login-visual-top">

          <Brand theme={theme} />

          <LanguageSwitch
            language={language}
            onChange={onLanguageChange}
          />

        </div>


        <div className="login-message">

          <span className="hero-kicker">
            <Sparkles size={14} />
            Intillegence AGENCY
          </span>

          <h1>
            People operations,
            <br />
            <em>with a pulse.</em>
          </h1>

          <p>
            Give every employee a clearer path
            through your organization.
          </p>

        </div>


        <div className="login-orbit">

          <div className="orbit-center">
            I
            <span>HR</span>
          </div>

          <div className="orbit-node node-one">
            <Users size={17} />
            People
          </div>

          <div className="orbit-node node-two">
            <ClipboardCheck size={17} />
            Onboarding
          </div>

          <div className="orbit-node node-three">
            <CalendarDays size={17} />
            Leave
          </div>

        </div>


        <small className="login-footnote">
          IntillegenceHR · PEOPLE OPERATIONS PLATFORM
        </small>

      </div>


      {/* RIGHT FORM */}

      <div className="login-form-side">

        <button
          className="back-link"
          onClick={() => navigate('/')}
        >
          <ArrowRight
            size={16}
            className="back-arrow"
          />
          Back to IntillegenceHR
        </button>


        <div className="login-form-wrap">

          <span className="eyebrow">
            WELCOME BACK
          </span>

          <h2>
            Sign in to your workspace.
          </h2>

          <p>
            Use your IntillegenceHR account to continue.
          </p>


          <form onSubmit={submit}>

            <label>
              Email address

              <input
                type="email"
                required
                placeholder="you@company.com"
              />
            </label>


            <label>
              Password

              <div className="password-input">

                <input
                  required
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>

              </div>

            </label>


            <div className="form-options">

              <label className="check-label">
                <input type="checkbox" />
                Remember me
              </label>

              <button
                type="button"
                className="link-button"
              >
                Forgot password?
              </button>

            </div>


            <button
              className="button primary submit-button"
              disabled={loading}
            >

              {loading
                ? 'Signing in...'
                : 'Sign in'}

              {!loading && (
                <ArrowRight size={16} />
              )}

            </button>

          </form>


          <div className="login-security">

            <LockKeyhole size={15} />

            Your session is protected with
            enterprise-grade security.

          </div>

        </div>

      </div>

    </div>
  )
}


/* =========================================================
   APP LAYOUT
========================================================= */

function AppLayout({
  language,
  theme,
  onThemeChange,
  onLanguageChange,
}: {
  language: Language
  theme: Theme
  onThemeChange: (theme: Theme) => void
  onLanguageChange: (language: Language) => void
}) {
  const [collapsed, setCollapsed] =
    useState(false)

  const [mobileOpen, setMobileOpen] =
    useState(false)

  const [showNotifications, setShowNotifications] =
    useState(false)

  const [search, setSearch] =
    useState('')

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

      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
          collapsed ? 'collapsed' : ''
        } ${
          mobileOpen ? 'mobile-open' : ''
        }`}
      >

        <div className="brand-wrap">

          <Brand
            compact={collapsed}
            theme={theme}
          />

          <button
            className="icon-button sidebar-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>

        </div>


        <div className="workspace-label">
          {text('WORKSPACE')}
        </div>


        <nav>

          {navItems.map(
            ({
              to,
              label,
              icon: Icon,
              badge,
            }) => (

              <NavLink
                key={to}
                to={to}
                title={
                  collapsed
                    ? text(
                        t[
                          label as keyof Translation
                        ],
                      )
                    : undefined
                }
                onClick={() =>
                  setMobileOpen(false)
                }
              >

                <Icon size={18} />

                <span>
                  {text(
                    t[
                      label as keyof Translation
                    ],
                  )}
                </span>

                {badge && (
                  <em>
                    {badge}
                  </em>
                )}

              </NavLink>

            ),
          )}

        </nav>


        {/* EXTENDED MODULES */}

        <div className="sidebar-group">

          <small>
            {text('EXTENDED MODULES')}
          </small>

          {futureModules.map(
            ({
              path,
              title,
              icon: Icon,
            }) => (

              <NavLink
                key={path}
                to={path}
                onClick={() =>
                  setMobileOpen(false)
                }
              >

                <Icon size={16} />

                <span>
                  {text(title)}
                </span>

              </NavLink>

            ),
          )}

        </div>


        {/* SIDEBAR BOTTOM */}

        <div className="sidebar-bottom">

          <div className="sidebar-help">

            <CircleHelp size={18} />

            <span>
              {text('Help & support')}
            </span>

          </div>


          <div className="mini-user">

            <div className="avatar">
              SE
            </div>

            {!collapsed && (
              <div>

                <strong>
                  {currentUser.name}
                </strong>

                <span>
                  {currentUser.title}
                </span>

              </div>
            )}

            <MoreHorizontal size={16} />

          </div>


          <div className="ecosystem">
            Intillegence AGENCY
            <span>•</span>
            PLATFORM
          </div>

        </div>

      </aside>


      {/* MAIN */}

      <main className="main-shell">

        {/* TOPBAR */}

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
            onClick={() =>
              setCollapsed(!collapsed)
            }
            aria-label="Toggle sidebar"
          >
            {collapsed ? (
              <PanelLeftOpen size={19} />
            ) : (
              <PanelLeftClose size={19} />
            )}
          </button>


          {/* SEARCH */}

          <div className="global-search">

            <Search size={17} />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder={text(t.search)}
            />

            <kbd>
              ⌘ K
            </kbd>


            {search && (
              <div className="search-results">

                {matches.length ? (

                  matches.map((employee) => (

                    <button
                      key={employee.id}
                      onClick={() => {
                        navigate(
                          '/app/employees',
                        )
                        setSearch('')
                      }}
                    >

                      <div className="avatar">
                        {employee.initials}
                      </div>

                      <span>

                        <strong>
                          {employee.firstName}{' '}
                          {employee.lastName}
                        </strong>

                        <small>
                          {text('Employees')}
                          {' · '}
                          {employee.jobTitle}
                        </small>

                      </span>

                      <ChevronRight size={15} />

                    </button>

                  ))

                ) : (

                  <span className="no-results">
                    {text('No people found')}
                  </span>

                )}

              </div>
            )}

          </div>


          {/* TOP ACTIONS */}

          <div className="top-actions">

            <LanguageSwitch
              language={language}
              onChange={onLanguageChange}
            />


            <button
              className="theme-toggle"
              onClick={() =>
                onThemeChange(
                  theme === 'dark'
                    ? 'light'
                    : 'dark',
                )
              }
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun size={17} />
              ) : (
                <Moon size={17} />
              )}
            </button>


            {/* NOTIFICATIONS */}

            <div className="notification-wrap">

              <button
                className="icon-button notification-button"
                onClick={() =>
                  setShowNotifications(
                    !showNotifications,
                  )
                }
                aria-label={text(
                  'Notifications',
                )}
              >

                <Bell size={19} />

                <i>
                  2
                </i>

              </button>


              {showNotifications && (
                <NotificationPanel />
              )}

            </div>


            {/* USER */}

            <div className="top-user">

              <div className="avatar">
                SE
              </div>

              <div>

                <strong>
                  {currentUser.name}
                </strong>

                <span>
                  {currentUser.title}
                </span>

              </div>

            </div>

          </div>

        </header>


        {/* CONTENT */}

        <div className="content">

          <Routes>

            <Route
              path="dashboard"
              element={
                <Dashboard t={t} />
              }
            />

            <Route
              path="employees"
              element={
                <People t={t} />
              }
            />

            <Route
              path="employees/:id"
              element={
                <People t={t} />
              }
            />

            <Route
              path="calendar"
              element={
                <CalendarPage />
              }
            />

            <Route
              path="documents"
              element={
                <DocumentsPage />
              }
            />

            <Route
              path="reports"
              element={
                <ReportsPage />
              }
            />

            <Route
              path="settings"
              element={
                <SettingsPage />
              }
            />

            <Route
              path="onboarding/*"
              element={
                <ModulePage
                  title="Onboarding"
                  data={onboardingRequests}
                />
              }
            />

            <Route
              path="offboarding/*"
              element={
                <ModulePage
                  title="Offboarding"
                  data={offboardingRequests}
                />
              }
            />

            <Route
              path="leave/*"
              element={
                <ModulePage
                  title="Leave management"
                  data={leaveRequests}
                />
              }
            />

            <Route
              path="holidays"
              element={
                <ModulePage
                  title="Holidays"
                  data={holidays}
                />
              }
            />

            <Route
              path="*"
              element={
                <ComingSoon />
              }
            />

          </Routes>

        </div>

      </main>

    </div>
  )
}


/* =========================================================
   NOTIFICATION PANEL
========================================================= */

function NotificationPanel() {
  const { text } = useI18n()

  return (
    <div className="notification-panel">

      <div className="panel-heading">

        <strong>
          {text('Notifications')}
        </strong>

        <button>
          {text('Mark all read')}
        </button>

      </div>


      {notifications.map(
        (notification) => (

          <div
            className="notification"
            key={notification.id}
          >

            <div
              className={`notification-icon ${notification.type}`}
            >

              {notification.type ===
              'warning' ? (
                <AlertCircle size={15} />
              ) : notification.type ===
                'success' ? (
                <CheckCircle2 size={15} />
              ) : (
                <ClipboardCheck size={15} />
              )}

            </div>


            <div>

              <strong>
                {text(notification.title)}
              </strong>

              <span>
                {text(notification.detail)}
              </span>

              <small>
                {text(notification.time)}
              </small>

            </div>

          </div>

        ),
      )}

    </div>
  )
}


/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({
  t,
}: {
  t: Translation
}) {
  return (
    <div className="page dashboard-page">

      <PageHeader
        eyebrow="MONDAY, 08 SEPTEMBER 2026"
        title="Good morning, Saad"
        subtitle="Here is what is happening across IntillegenceHR today."
      >

        <button className="button secondary">
          <FileText size={16} />
          {t.export}
        </button>

        <button className="button primary">
          <Plus size={16} />
          {t.create}
        </button>

      </PageHeader>


      {/* KPI GRID */}

      <section className="kpi-grid">

        <KpiCard
          label={t.employees}
          value="248"
          trend="+4.2%"
          note="vs last month"
          icon={<Users size={18} />}
        />

        <KpiCard
          label={t.activeOnboarding}
          value="12"
          trend="3"
          note="requiring attention"
          icon={<ClipboardCheck size={18} />}
          warning
        />

        <KpiCard
          label={t.activeOffboarding}
          value="5"
          trend="2"
          note="overdue"
          icon={<LogOut size={18} />}
          warning
        />

        <KpiCard
          label={t.onLeave}
          value="18"
          trend="This week"
          note="across 5 departments"
          icon={<CalendarDays size={18} />}
        />

        <KpiCard
          label="Profile completion"
          value="91%"
          trend="+5%"
          note="vs last quarter"
          icon={<CheckCircle2 size={18} />}
        />

      </section>


      <div className="dashboard-grid">

        {/* WORKFORCE */}

        <section className="panel workforce-panel">

          <PanelTitle
            title="Workforce overview"
            subtitle="Headcount by department"
            action="Last 6 months"
          />

          <div className="chart-area">

            <div className="y-axis">
              <span>80</span>
              <span>60</span>
              <span>40</span>
              <span>20</span>
              <span>0</span>
            </div>


            <div className="bar-chart">

              {departments.map(
                (department, index) => (

                  <div
                    className="bar-group"
                    key={department.id}
                  >

                    <div className="bars">

                      <div
                        className="bar previous"
                        style={{
                          height: `${
                            40 + index * 7
                          }px`,
                        }}
                      />

                      <div
                        className="bar current"
                        style={{
                          height: `${
                            58 + index * 8
                          }px`,
                        }}
                      />

                    </div>

                    <span>
                      {department.name.split(' ')[0]}
                    </span>

                  </div>

                ),
              )}

            </div>

          </div>


          <div className="chart-legend">

            <span>
              <i className="legend-dot blue" />
              Current
            </span>

            <span>
              <i className="legend-dot muted" />
              Previous period
            </span>

            <strong>
              <ArrowRight size={14} />
              8.4% headcount growth
            </strong>

          </div>

        </section>


        {/* HR PULSE */}

        <section className="panel pulse-panel">

          <PanelTitle
            title="HR pulse"
            subtitle="September 2026"
            action="View reports"
          />

          <div className="pulse-ring">

            <div>
              <strong>91%</strong>
              <span>
                Profile completion
              </span>
            </div>

          </div>


          <div className="pulse-stats">

            <span>
              <i className="legend-dot blue" />
              226 complete
            </span>

            <span>
              <i className="legend-dot orange" />
              22 need attention
            </span>

          </div>

        </section>


        {/* ONBOARDING */}

        <section className="panel workflow-panel">

          <PanelTitle
            title="Onboarding workflow"
            subtitle="12 active requests"
            action="View all"
          />

          <div className="workflow-list">

            {[
              'Created',
              'HR Validation',
              'Manager',
              'Local IT',
              'ISD',
              'Completed',
            ].map(
              (stage, index) => (

                <div
                  className="workflow-step"
                  key={stage}
                >

                  <div
                    className={`step-icon ${
                      index < 3
                        ? 'done'
                        : index === 3
                          ? 'current'
                          : ''
                    }`}
                  >

                    {index < 3 ? (
                      <CheckCircle2 size={15} />
                    ) : index === 3 ? (
                      <Clock3 size={15} />
                    ) : (
                      index + 1
                    )}

                  </div>

                  <span>
                    {stage}
                  </span>

                  <strong>
                    {
                      [12, 10, 8, 6, 4, 2][
                        index
                      ]
                    }
                  </strong>

                </div>

              ),
            )}

          </div>

        </section>


        {/* EVENTS */}

        <section className="panel events-panel">

          <PanelTitle
            title={t.upcoming}
            subtitle="Your schedule"
            action="Open calendar"
          />

          <Event
            date="Today"
            time="09:00"
            title="HR leadership sync"
            detail="Atlas meeting room"
            color="blue"
          />

          <Event
            date="Tomorrow"
            time="10:00"
            title="Ahmed Benali · Onboarding"
            detail="ISD technical setup"
            color="mint"
          />

          <Event
            date="Friday"
            time="All day"
            title="Sara El Idrissi · Annual leave"
            detail="4 working days"
            color="orange"
          />

        </section>


        {/* ACTIVITY */}

        <section className="panel activity-panel">

          <PanelTitle
            title={t.recent}
            subtitle="Across your workspace"
            action="View audit log"
          />

          <Activity
            icon={<Users size={15} />}
            title="New employee profile created"
            detail="Yassine Fathi · Finance"
            time="18 min ago"
          />

          <Activity
            icon={<CheckCircle2 size={15} />}
            title="Leave request approved"
            detail="Sara El Idrissi · Annual leave"
            time="1 hour ago"
          />

          <Activity
            icon={<Laptop size={15} />}
            title="Equipment marked as returned"
            detail="OFF-2026-0006 · MacBook Pro"
            time="Yesterday"
          />

        </section>

      </div>

    </div>
  )
}


/* =========================================================
   ANIMATED METRIC
========================================================= */

function AnimatedMetric({
  value,
}: {
  value: string
}) {
  const numeric = Number.parseInt(
    value,
    10,
  )

  const suffix = value.replace(
    String(numeric),
    '',
  )

  const [display, setDisplay] =
    useState(0)


  useEffect(() => {

    let frame = 0

    const started = performance.now()

    const tick = (now: number) => {

      const progress = Math.min(
        (now - started) / 420,
        1,
      )

      setDisplay(
        Math.round(
          numeric *
            (1 -
              Math.pow(
                1 - progress,
                3,
              )),
        ),
      )

      if (progress < 1) {
        frame =
          requestAnimationFrame(tick)
      }

    }

    frame =
      requestAnimationFrame(tick)

    return () =>
      cancelAnimationFrame(frame)

  }, [numeric])


  return (
    <>
      {display}
      {suffix}
    </>
  )
}


/* =========================================================
   KPI CARD
========================================================= */

function KpiCard({
  label,
  value,
  trend,
  note,
  icon,
  warning = false,
}: {
  label: string
  value: string
  trend: string
  note: string
  icon: ReactNode
  warning?: boolean
}) {
  return (
    <motion.div
      className="kpi-card"
      variants={sidebarLabels}
      initial="collapsed"
      animate="expanded"
      whileHover={{
        y: -3,
        transition: {
          duration: 0.16,
        },
      }}
    >

      <div
        className={`kpi-icon ${
          warning ? 'warning' : ''
        }`}
      >
        {icon}
      </div>

      <span className="kpi-label">
        {label}
      </span>

      <strong className="kpi-value">
        <AnimatedMetric value={value} />
      </strong>

      <div
        className={`kpi-trend ${
          warning ? 'warning-text' : ''
        }`}
      >

        {!warning && (
          <ArrowRight size={14} />
        )}

        {trend}

        <small>
          {note}
        </small>

      </div>

    </motion.div>
  )
}


/* =========================================================
   PAGE HEADER
========================================================= */

function PageHeader({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string
  title: string
  subtitle: string
  children?: ReactNode
}) {
  return (
    <div className="page-header">

      <div>

        <span className="eyebrow">
          {eyebrow}
        </span>

        <h1>
          {title}
        </h1>

        <p>
          {subtitle}
        </p>

      </div>

      <div className="header-actions">
        {children}
      </div>

    </div>
  )
}


/* =========================================================
   PANEL TITLE
========================================================= */

function PanelTitle({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle: string
  action: string
}) {
  return (
    <div className="panel-title">

      <div>

        <h2>
          {title}
        </h2>

        <span>
          {subtitle}
        </span>

      </div>

      <button className="text-button">

        {action}

        <ChevronRight size={14} />

      </button>

    </div>
  )
}


/* =========================================================
   EVENT
========================================================= */

function Event({
  date,
  time,
  title,
  detail,
  color,
}: {
  date: string
  time: string
  title: string
  detail: string
  color: string
}) {
  return (
    <div className="event">

      <div
        className={`event-date ${color}`}
      >

        <strong>
          {date}
        </strong>

        <span>
          {time}
        </span>

      </div>


      <div>

        <strong>
          {title}
        </strong>

        <span>
          {detail}
        </span>

      </div>


      <ChevronRight size={15} />

    </div>
  )
}


/* =========================================================
   ACTIVITY
========================================================= */

function Activity({
  icon,
  title,
  detail,
  time,
}: {
  icon: ReactNode
  title: string
  detail: string
  time: string
}) {
  return (
    <div className="activity">

      <div className="activity-icon">
        {icon}
      </div>

      <div>

        <strong>
          {title}
        </strong>

        <span>
          {detail}
        </span>

      </div>

      <time>
        {time}
      </time>

    </div>
  )
}


/* =========================================================
   PEOPLE
========================================================= */

function People({
  t,
}: {
  t: Translation
}) {
  const [search, setSearch] =
    useState('')

  const [status, setStatus] =
    useState<'All' | EmployeeStatus>(
      'All',
    )

  const [selected, setSelected] =
    useState<Employee | null>(null)


  const filtered = useMemo(
    () =>
      employees.filter(
        (employee) =>
          `${employee.firstName} ${employee.lastName} ${employee.jobTitle} ${employee.department}`
            .toLowerCase()
            .includes(
              search.toLowerCase(),
            ) &&
          (status === 'All' ||
            employee.status === status),
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

        <button className="button primary">
          <Plus size={16} />
          Add employee
        </button>

      </PageHeader>


      {/* SUMMARY */}

      <div className="directory-summary">

        <div>
          <span>Active employees</span>
          <strong>226</strong>
          <small>
            91.1% of workforce
          </small>
        </div>

        <div>
          <span>On leave today</span>
          <strong>18</strong>
          <small>
            7.3% of workforce
          </small>
        </div>

        <div>
          <span>Departments</span>
          <strong>8</strong>
          <small>
            Across 4 locations
          </small>
        </div>

        <div>
          <span>New this month</span>
          <strong>+6</strong>
          <small className="green-text">
            Ahead of target
          </small>
        </div>

      </div>


      {/* DIRECTORY */}

      <section className="panel directory-panel">

        <div className="directory-toolbar">

          <div className="table-search">

            <Search size={16} />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder={t.search}
            />

          </div>


          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as
                  | 'All'
                  | EmployeeStatus,
              )
            }
          >

            <option>
              All
            </option>

            <option>
              Active
            </option>

            <option>
              On Leave
            </option>

            <option>
              Suspended
            </option>

          </select>


          <button className="filter-button">

            <Settings size={16} />

            Filters

            <span>
              2
            </span>

          </button>


          <button className="icon-button">

            <MoreHorizontal size={18} />

          </button>

        </div>


        <div className="table-wrap">

          <table>

            <thead>

              <tr>

                <th>
                  Employee
                </th>

                <th>
                  Job title
                </th>

                <th>
                  Department
                </th>

                <th>
                  Manager
                </th>

                <th>
                  Location
                </th>

                <th>
                  Status
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {filtered.map(
                (employee) => (

                  <tr
                    key={employee.id}
                    onClick={() =>
                      setSelected(employee)
                    }
                  >

                    <td>

                      <div className="employee-cell">

                        <div className="avatar employee-avatar">
                          {employee.initials}
                        </div>

                        <div>

                          <strong>
                            {employee.firstName}{' '}
                            {employee.lastName}
                          </strong>

                          <span>
                            EMP-{employee.id}
                          </span>

                        </div>

                      </div>

                    </td>


                    <td>

                      {employee.jobTitle}

                      <small className="type-label">
                        {employee.employmentType}
                      </small>

                    </td>


                    <td>
                      {employee.department}
                    </td>


                    <td>
                      {employee.manager}
                    </td>


                    <td>
                      {employee.location}
                    </td>


                    <td>
                      <StatusBadge
                        status={
                          employee.status
                        }
                      />
                    </td>


                    <td>

                      <button
                        className="icon-button"
                        onClick={(event) =>
                          event.stopPropagation()
                        }
                      >
                        <MoreHorizontal size={17} />
                      </button>

                    </td>

                  </tr>

                ),
              )}

            </tbody>

          </table>

        </div>


        <div className="table-footer">

          <span>
            Showing {filtered.length} of 248
            employees
          </span>

          <span>
            Page 1 of 25
            <ChevronRight size={15} />
          </span>

        </div>

      </section>


      {selected && (
        <EmployeeDrawer
          employee={selected}
          onClose={() =>
            setSelected(null)
          }
        />
      )}

    </div>
  )
}


/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status,
}: {
  status: string
}) {
  return (
    <span
      className={`status-badge ${status
        .toLowerCase()
        .replace(' ', '-')}`}
    >
      {status}
    </span>
  )
}


/* =========================================================
   EMPLOYEE DRAWER
========================================================= */

function EmployeeDrawer({
  employee,
  onClose,
}: {
  employee: Employee
  onClose: () => void
}) {
  return (
    <div
      className="drawer-backdrop"
      onClick={onClose}
    >

      <aside
        className="employee-drawer"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        <div className="drawer-header">

          <span>
            EMPLOYEE PROFILE
          </span>

          <button
            className="icon-button"
            onClick={onClose}
          >
            <X size={18} />
          </button>

        </div>


        <div className="profile-heading">

          <div className="avatar profile-avatar">
            {employee.initials}
          </div>

          <div>

            <h2>
              {employee.firstName}{' '}
              {employee.lastName}
            </h2>

            <p>
              {employee.jobTitle}
            </p>

            <StatusBadge
              status={employee.status}
            />

          </div>

        </div>


        <div className="profile-details">

          <div>
            <span>Employee ID</span>
            <strong>
              EMP-{employee.id}
            </strong>
          </div>

          <div>
            <span>Department</span>
            <strong>
              {employee.department}
            </strong>
          </div>

          <div>
            <span>Manager</span>
            <strong>
              {employee.manager}
            </strong>
          </div>

          <div>
            <span>Joined</span>
            <strong>
              {employee.joined}
            </strong>
          </div>

          <div>
            <span>Location</span>
            <strong>
              {employee.location}
            </strong>
          </div>

          <div>
            <span>Email</span>
            <strong>
              {employee.email}
            </strong>
          </div>

        </div>


        <div className="profile-tabs">

          <button className="active">
            Overview
          </button>

          <button>
            Documents
          </button>

          <button>
            Leave
          </button>

          <button>
            Activity
          </button>

        </div>


        <div className="profile-section">

          <h3>
            360° employee view
          </h3>

          <div className="link-row">

            <BriefcaseBusiness size={16} />

            <span>
              Onboarding history
            </span>

            <ChevronRight size={15} />

          </div>


          <div className="link-row">

            <CalendarDays size={16} />

            <span>
              Leave balance & requests
            </span>

            <ChevronRight size={15} />

          </div>


          <div className="link-row">

            <ShieldCheck size={16} />

            <span>
              Documents & certifications
            </span>

            <ChevronRight size={15} />

          </div>

        </div>

      </aside>

    </div>
  )
}


/* =========================================================
   MODULE PAGE
========================================================= */

function ModulePage({
  title,
  data,
}: {
  title: string
  data: unknown[]
}) {
  return (
    <div className="page">

      <PageHeader
        eyebrow="IntillegenceHR WORKSPACE"
        title={title}
        subtitle="Keep your people operations moving with clarity and control."
      >

        <button className="button secondary">
          <FileText size={16} />
          Export
        </button>

        <button className="button primary">
          <Plus size={16} />
          Create request
        </button>

      </PageHeader>


      <div className="module-hero">

        <div className="module-icon">
          <BriefcaseBusiness size={22} />
        </div>

        <div>

          <h2>
            {title} workspace
          </h2>

          <p>
            This module is connected to the shared
            HR data layer. Mock records are ready
            to be replaced by REST services.
          </p>

        </div>


        <div className="module-metrics">

          <span>
            <strong>
              {data.length}
            </strong>
            {' '}
            Active records
          </span>

          <span>
            <strong>
              94%
            </strong>
            {' '}
            On time
          </span>

        </div>

      </div>


      <section className="panel module-panel">

        <PanelTitle
          title="Work queue"
          subtitle="Updated just now"
          action="Configure columns"
        />


        <div className="module-list">

          {data.map(
            (item, index) => {

              const record =
                item as Record<
                  string,
                  unknown
                >

              const name = String(
                record.employee ||
                  record.name ||
                  'Annual leave balance',
              )

              const id = String(
                record.id || index,
              )

              const progress =
                typeof record.progress ===
                'number'
                  ? record.progress
                  : undefined


              return (
                <div
                  className="module-row"
                  key={id}
                >

                  <div className="row-leading">

                    <div className="avatar">
                      {name
                        .split(' ')
                        .map(
                          (part) =>
                            part[0],
                        )
                        .join('')
                        .slice(0, 2)}
                    </div>

                    <div>

                      <strong>
                        {name}
                      </strong>

                      <span>
                        {String(
                          record.position ||
                            record.date ||
                            record.start ||
                            'Workflow record',
                        )}
                      </span>

                    </div>

                  </div>


                  <div className="row-meta">

                    {progress !==
                    undefined ? (

                      <>
                        <div className="mini-progress">

                          <span
                            style={{
                              width: `${progress}%`,
                            }}
                          />

                        </div>

                        <small>
                          {progress}%
                        </small>
                      </>

                    ) : (

                      <StatusBadge
                        status={String(
                          record.status ||
                            'Ready',
                        )}
                      />

                    )}


                    <button className="icon-button">

                      <MoreHorizontal
                        size={16}
                      />

                    </button>

                  </div>

                </div>
              )
            },
          )}

        </div>

      </section>

    </div>
  )
}


/* =========================================================
   COMING SOON
========================================================= */

function ComingSoon() {
  const { text } = useI18n()
  const location = useLocation()

  const module =
    futureModules.find((item) =>
      location.pathname.includes(
        item.path.replace(
          '/app/',
          '',
        ),
      ),
    ) ||
    futureModules[0]

  const Icon = module.icon


  return (
    <div className="page coming-page">

      <div className="coming-illustration">
        <Icon size={32} />
      </div>

      <span className="eyebrow">
        {text('EXTENDED MODULE')}
      </span>

      <h1>
        {text(module.title)}
      </h1>

      <p>
        {text(module.detail)}
      </p>

      <span className="coming-badge">

        <Clock3 size={14} />

        {text('Coming soon')}

      </span>


      <div className="coming-note">

        <Sparkles size={16} />

        {text(
          'Your current HR foundation is ready for this future capability.',
        )}

      </div>

    </div>
  )
}


/* =========================================================
   CALENDAR
========================================================= */

function CalendarPage() {
  return (
    <div className="page">

      <PageHeader
        eyebrow="PLANNING HUB"
        title="HR calendar"
        subtitle="See leave, holidays and people milestones in one shared view."
      >

        <button className="button secondary">
          <CalendarDays size={16} />
          Agenda
        </button>

        <button className="button primary">
          <Plus size={16} />
          Add event
        </button>

      </PageHeader>


      <section className="panel calendar-panel">

        <div className="calendar-toolbar">

          <button className="icon-button">
            <ChevronRight size={17} />
          </button>

          <strong>
            September 2026
          </strong>

          <button className="icon-button">
            <ChevronRight size={17} />
          </button>


          <div className="view-switch">

            <button className="active">
              Month
            </button>

            <button>
              Week
            </button>

            <button>
              Agenda
            </button>

          </div>

        </div>


        <div className="calendar-grid">

          {[
            'Mon',
            'Tue',
            'Wed',
            'Thu',
            'Fri',
            'Sat',
            'Sun',
          ].map((day) => (

            <span
              className="calendar-day-name"
              key={day}
            >
              {day}
            </span>

          ))}


          {Array.from(
            { length: 35 },
            (_, index) => (

              <div
                className={`calendar-cell ${
                  index === 9 ||
                  index === 10
                    ? 'selected'
                    : ''
                }`}
                key={index}
              >

                <span>
                  {index < 1
                    ? ''
                    : ((index + 31) %
                        30) +
                      1}
                </span>


                {index === 14 && (
                  <i className="calendar-event blue">
                    Leadership sync
                  </i>
                )}


                {index === 16 && (
                  <i className="calendar-event mint">
                    Sara · Leave
                  </i>
                )}


                {index === 25 && (
                  <i className="calendar-event orange">
                    Company holiday
                  </i>
                )}

              </div>

            ),
          )}

        </div>

      </section>

    </div>
  )
}


/* =========================================================
   DOCUMENTS
========================================================= */

function DocumentsPage() {
  return (
    <div className="page">

      <PageHeader
        eyebrow="PEOPLE RECORDS"
        title="Employee documents"
        subtitle="Keep contracts, identity documents and certifications current."
      >

        <button className="button secondary">
          <FolderOpen size={16} />
          Document types
        </button>

        <button className="button primary">
          <Plus size={16} />
          Upload document
        </button>

      </PageHeader>


      <section className="panel document-panel">

        <div className="document-summary">

          <div>
            <span>Total documents</span>
            <strong>684</strong>
          </div>

          <div>
            <span>Expiring soon</span>
            <strong className="orange-text">
              12
            </strong>
          </div>

          <div>
            <span>Missing</span>
            <strong className="red-text">
              8
            </strong>
          </div>

        </div>


        <div className="table-wrap">

          <table>

            <thead>

              <tr>

                <th>
                  Document
                </th>

                <th>
                  Employee
                </th>

                <th>
                  Type
                </th>

                <th>
                  Uploaded
                </th>

                <th>
                  Expiry
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {[
                [
                  'Passport · Ahmed Benali',
                  'Ahmed Benali',
                  'Identity document',
                  '12 Mar 2025',
                  '12 Oct 2026',
                  'Expiring soon',
                ],

                [
                  'Employment contract · Sara El Idrissi',
                  'Sara El Idrissi',
                  'Contract',
                  '03 Jun 2023',
                  '03 Jun 2027',
                  'Valid',
                ],

                [
                  'Cloud certification · Othmane Berrada',
                  'Othmane Berrada',
                  'Certification',
                  '06 Sep 2025',
                  '06 Sep 2026',
                  'Expired',
                ],
              ].map((row) => (

                <tr key={row[0]}>

                  {row.map(
                    (cell, index) => (

                      <td key={cell}>

                        {index === 5 ? (
                          <StatusBadge
                            status={cell}
                          />
                        ) : (
                          cell
                        )}

                      </td>

                    ),
                  )}

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  )
}


/* =========================================================
   REPORTS
========================================================= */

function ReportsPage() {
  return (
    <div className="page">

      <PageHeader
        eyebrow="PEOPLE ANALYTICS"
        title="Reports"
        subtitle="Turn workforce data into a clear operating picture."
      >

        <button className="button secondary">
          <Globe2 size={16} />
          Filters
        </button>

        <button className="button primary">
          <FileText size={16} />
          Export report
        </button>

      </PageHeader>


      <div className="report-grid">

        <section className="panel report-card wide">

          <PanelTitle
            title="Headcount trend"
            subtitle="Last 6 months"
            action="View detail"
          />

          <div className="line-chart">

            {[32, 38, 35, 55, 62, 74, 80].map(
              (height, index) => (

                <span
                  style={{
                    height: `${height}%`,
                  }}
                  key={index}
                />

              ),
            )}

          </div>

        </section>


        <section className="panel report-card">

          <PanelTitle
            title="Department mix"
            subtitle="248 employees"
            action=""
          />

          <div className="donut-chart">

            <strong>
              248
              <small>
                people
              </small>
            </strong>

          </div>


          <div className="report-legend">

            <span>
              <i className="legend-dot blue" />
              Engineering · 64
            </span>

            <span>
              <i className="legend-dot mint" />
              Operations · 48
            </span>

            <span>
              <i className="legend-dot orange" />
              Commercial · 37
            </span>

          </div>

        </section>


        <section className="panel report-card wide">

          <PanelTitle
            title="Leave trends"
            subtitle="Requests by month"
            action="View detail"
          />

          <div className="report-bars">

            {[43, 62, 48, 75, 54, 68, 82, 59, 73].map(
              (height, index) => (

                <i
                  style={{
                    height: `${height}%`,
                  }}
                  key={index}
                />

              ),
            )}

          </div>

        </section>

      </div>

    </div>
  )
}


/* =========================================================
   SETTINGS
========================================================= */

function SettingsPage() {
  return (
    <div className="page">

      <PageHeader
        eyebrow="ADMINISTRATION"
        title="Settings"
        subtitle="Shape IntillegenceHR around the way your organization works."
      />


      <div className="settings-layout">

        <aside className="settings-menu">

          {[
            'Profile',
            'Account',
            'Users',
            'Roles & Permissions',
            'Leave Types',
            'Leave Policies',
            'Onboarding Checklists',
            'Offboarding Checklists',
            'Equipment',
            'Applications',
            'Notifications',
            'Languages',
            'Appearance',
            'Audit Logs',
          ].map(
            (item, index) => (

              <button
                className={
                  index === 0
                    ? 'active'
                    : ''
                }
                key={item}
              >

                {item}

                <ChevronRight size={15} />

              </button>

            ),
          )}

        </aside>


        <section className="panel settings-content">

          <span className="eyebrow">
            PROFILE
          </span>

          <h2>
            Profile details
          </h2>

          <p>
            Manage the identity and contact
            details attached to your workspace
            account.
          </p>


          <div className="settings-avatar">

            <div className="profile-avatar avatar">
              SE
            </div>

            <div>

              <strong>
                {currentUser.name}
              </strong>

              <span>
                {currentUser.title}
              </span>

            </div>

            <button className="button secondary">
              Change photo
            </button>

          </div>


          <div className="settings-fields">

            <label>

              Full name

              <input
                value={currentUser.name}
                readOnly
              />

            </label>


            <label>

              Role

              <input
                value={currentUser.title}
                readOnly
              />

            </label>


            <label>

              Email

              <input
                value="saad@Intillegence.com"
                readOnly
              />

            </label>


            <label>

              Language

              <select defaultValue="English">

                <option>
                  English
                </option>

                <option>
                  Français
                </option>

                <option>
                  العربية
                </option>

              </select>

            </label>

          </div>


          <button className="button primary">
            Save changes
          </button>

        </section>

      </div>

    </div>
  )
}


/* =========================================================
   EXPORT
========================================================= */

export default App