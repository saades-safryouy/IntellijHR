import { createContext, useContext } from 'react'

export type Language = 'en' | 'fr' | 'ar'
export type Theme = 'dark' | 'light'

export const translations = {
  en: {
    dashboard: 'Dashboard',
    people: 'People',
    onboarding: 'Onboarding',
    offboarding: 'Offboarding',
    leave: {
      label: 'Leave',
      balance: 'Leave Balance',
      request: 'Request Leave',
      used: 'Used',
      pending: 'Pending',
      remaining: 'Remaining',
      low_balance: 'Low balance',
    },
    holidays: 'Holidays',
    documents: 'Documents',
    calendar: 'Calendar',
    reports: 'Reports',
    settings: 'Settings',
    common: {
      tasks: 'Tasks',
      delete: 'Delete',
      add_task: 'Add Task',
    },
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
    leave: {
      label: 'Congés',
      balance: 'Solde des congés',
      request: 'Demander des congés',
      used: 'Utilisé',
      pending: 'En attente',
      remaining: 'Restant',
      low_balance: 'Solde bas',
    },
    holidays: 'Jours fériés',
    documents: 'Documents',
    calendar: 'Calendrier',
    reports: 'Rapports',
    settings: 'Paramètres',
    common: {
      tasks: 'Tâches',
      delete: 'Supprimer',
      add_task: 'Ajouter une tâche',
    },
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
    leave: {
      label: 'الإجازات',
      balance: 'رصيد الإجازات',
      request: 'طلب إجازة',
      used: 'المستخدم',
      pending: 'قيد الانتظار',
      remaining: 'المتبقي',
      low_balance: 'الرصيد منخفض',
    },
    holidays: 'العطل',
    documents: 'المستندات',
    calendar: 'التقويم',
    reports: 'التقارير',
    settings: 'الإعدادات',
    common: {
      tasks: 'المهام',
      delete: 'حذف',
      add_task: 'إضافة مهمة',
    },
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
} as const

export type Translation = typeof translations.en
export type TranslationKey = keyof Translation

export function resolveLocaleValue(locale: Record<string, unknown>, key: string): string | undefined {
  const path = key.split('.')
  let value: unknown = locale

  for (const segment of path) {
    if (value === null || typeof value !== 'object' || !(segment in value)) {
      return undefined
    }
    value = (value as Record<string, unknown>)[segment]
  }

  return typeof value === 'string' ? value : undefined
}

export const phraseTranslations: Record<Language, Record<string, string>> = {
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

export const I18nContext = createContext<{
  language: Language
  text: (key: TranslationKey | string) => string
}>({
  language: 'en',
  text: (key) => resolveLocaleValue(translations.en as Record<string, unknown>, key) || key,
})

export function useI18n() {
  return useContext(I18nContext)
}
