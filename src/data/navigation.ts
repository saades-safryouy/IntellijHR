import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  LogOut,
  CalendarDays,
  FolderOpen,
  BarChart3,
  Settings,
  BriefcaseBusiness,
  Clock3,
  GraduationCap,
  WalletCards,
} from 'lucide-react'

export type NavItem = {
  to: string
  label: string
  icon: typeof LayoutDashboard
  badge?: string
}

export const navItems: NavItem[] = [
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

export const futureModules = [
  {
    path: '/app/recruitment',
    title: 'Recruitment',
    detail: 'Connect future hiring workflows directly to onboarding.',
    icon: BriefcaseBusiness,
  },
  {
    path: '/app/attendance',
    title: 'Attendance',
    detail: 'Time and attendance insights are being prepared for the next release.',
    icon: Clock3,
  },
  {
    path: '/app/performance',
    title: 'Performance',
    detail: 'Build a continuous performance culture with a connected people layer.',
    icon: BarChart3,
  },
  {
    path: '/app/training',
    title: 'Training & Development',
    detail: 'Learning journeys and skills intelligence will arrive here.',
    icon: GraduationCap,
  },
  {
    path: '/app/payroll',
    title: 'Payroll & Compensation',
    detail: 'Compensation intelligence will connect to the employee profile.',
    icon: WalletCards,
  },
]
