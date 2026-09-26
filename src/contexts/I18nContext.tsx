import { createContext, useContext } from 'react'

export type Language = 'en' | 'fr' | 'ar'
export type Theme = 'dark' | 'light'

export const translations = {
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
} as const

export type Translation = typeof translations.en
export type TranslationKey = keyof Translation

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
  text: (key) =>
    translations.en[key as TranslationKey] || key,
})

export function useI18n() {
  return useContext(I18nContext)
}
