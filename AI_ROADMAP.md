# AI_ROADMAP.md — IntillgenceHR

*Persistent roadmap and source of truth for AI coding agents. Updated after each meaningful change.*

---

## PROJECT

**Project name:** IntillgenceHR  
**Parent ecosystem:** IntillgenceAgency  
**Ecosystem siblings:** IntillgenceLogistics, IntillgenceSchool, IntillgenceBusiness

**Purpose:** HR Management System for employee information and employee lifecycle processes.

**Core HRMS scope (implemented):**
- People / Employees
- Onboarding
- Offboarding
- Leave Management
- Holidays

**Additional implemented areas:**
- Authentication (login, session via sessionStorage)
- Dashboard (HR)
- Documents
- Calendar
- Reports
- Settings
- Notifications
- Landing page
- Dark / Light theme
- Internationalization (EN / FR / AR)

**Coming Soon (placeholder pages):**
- Recruitment
- Attendance
- Performance
- Training & Development
- Payroll & Compensation

---

## ARCHITECTURE (actual, inspected)

| Layer | Technology / Pattern |
|-------|---------------------|
| **Frontend framework** | React 19 (functional components, hooks) |
| **Language** | TypeScript (strict, `tsc -b` passes) |
| **Routing** | `react-router-dom` v7, `BrowserRouter`, nested routes under `/app/*` |
| **State management** | React `useState` / `useMemo` in `App.tsx`; no global store (Redux, Zustand, etc.) |
| **Contexts** | `I18nContext` (language, translations, theme) — single provider in `App.tsx` |
| **Hooks** | No custom hooks folder; logic inline in components |
| **Component structure** | `src/components/` with subfolders: `layout/`, `common/`, `dashboard/`, `employees/`, `notifications/` |
| **Pages** | `src/pages/` — one file per route; dashboard, people, onboarding, offboarding, leave, holidays, documents, calendar, reports, settings, auth, plus 5 coming-soon pages |
| **Styling** | Tailwind CSS v4 via `@tailwindcss/vite`; custom `App.css` (design tokens, component classes); `LandingPage.css` for landing animations |
| **UI libraries** | `lucide-react` (icons), `framer-motion` (animations), `clsx` + `tailwind-merge` (class composition) |
| **Charts** | `recharts` v3 (installed, not yet used in modular pages — original used inline SVG/HTML bar charts) |
| **Forms** | `react-hook-form` + `zod` + `@hookform/resolvers` (installed, not yet used) |
| **i18n** | `i18next` + `react-i18next` (installed) but **not wired** — actual translations live in `I18nContext.tsx` as plain objects |
| **Auth mechanism** | Single `isAuthenticated` boolean in `App.tsx` persisted to `sessionStorage`; login sets it true; logout clears it; no JWT, no refresh, no role check yet |
| **Backend / API** | None — all data from `src/data/mock.ts` |
| **Database** | None |
| **Theme system** | `dark` / `light` persisted to `localStorage`; applied via `data-theme` on `<html>` in `App.tsx` |
| **Build tooling** | Vite 8, TypeScript 6, Oxlint; `npm run build` = `tsc -b && vite build` |

---

## CURRENT REFACTORING STATE

The original monolithic `App_ORIGINAL.tsx` (~3000 lines) has been split into modular components. Extraction is **complete for all pages** and shared UI.

| Area | Status | Notes |
|------|--------|-------|
| `contexts/I18nContext.tsx` | **COMPLETED** | Translations, phrase map, theme, language switching |
| `components/layout/` | **COMPLETED** | `AppLayout`, `Brand`, `LanguageSwitch` |
| `components/common/` | **COMPLETED** | `PageHeader`, `PanelTitle`, `ModulePage`, `ComingSoon` |
| `components/dashboard/` | **COMPLETED** | `KpiCard`, `Event`, `Activity`, `AnimatedMetric` |
| `components/employees/` | **COMPLETED** | `StatusBadge` |
| `components/notifications/` | **COMPLETED** | `NotificationPanel` |
| `pages/auth/LoginPage.tsx` | **COMPLETED** | Visual parity with `App_ORIGINAL` restored |
| `pages/dashboard/` | **COMPLETED** | KPIs, workforce chart, pulse, workflow, events, activity |
| `pages/people/` | **COMPLETED** | Directory, search, filters, employee drawer |
| `pages/onboarding/` | **COMPLETED** | Uses `ModulePage` work-queue |
| `pages/offboarding/` | **COMPLETED** | Uses `ModulePage` work-queue |
| `pages/leave/` | **COMPLETED** | Uses `ModulePage` work-queue |
| `pages/holidays/` | **COMPLETED** | Uses `ModulePage` work-queue |
| `pages/documents/` | **COMPLETED** | Table with status badges |
| `pages/calendar/` | **COMPLETED** | Month grid, toolbar, view switch |
| `pages/reports/` | **COMPLETED** | Line chart, donut, bar charts (inline HTML/CSS) |
| `pages/settings/` | **COMPLETED** | Sidebar menu + profile content (static) |
| `pages/recruitment|attendance|performance|training|payroll/` | **COMPLETED** | All render `ComingSoon` |
| `App.tsx` routing | **COMPLETED** | Public `/`, `/login`, protected `/app/*`, fallback to `/` |

**Visual parity:** All modular pages now use the same class names (`page`, `panel`, `kpi-card`, `notification-panel`, `employee-drawer`, `directory-summary`, `coming-page`, etc.) as `App_ORIGINAL.tsx`. `App.css` is unchanged from the original design system.

---

## AUTHENTICATION ROADMAP

### Current implementation
- One login page (`/login`)
- On submit: `sessionStorage.setItem('Intillegence-authenticated', 'true')`, navigate to `/app/dashboard`
- `App.tsx` reads flag on mount; guards `/app/*` with `<Navigate to="/login" replace />`
- Logout clears flag, navigates to `/login`
- **No roles**, **no employee route**, **no route-level permissions**

### Target (role-based)
| Role | Login → Route | Access |
|------|---------------|--------|
| HR / HR Administrator | `/app/dashboard` | All `/app/*` routes |
| Employee | `/employee/dashboard` | Only `/employee/*` routes (self-service) |
| Manager | TBD | Team-scoped `/app/*` subset |

### Remaining work
1. Extend `User` type in `models.ts` with `role: 'HR' | 'Employee' | 'Manager'`
2. Update mock `currentUser` or add `mockUsers` with roles
3. Login page: accept credentials → resolve role → set `sessionStorage` with role
4. Create `AuthContext` providing `user`, `role`, `login()`, `logout()`, `hasRole()`
5. Add `<EmployeeRoute>` / `<HRRoute>` wrapper components
6. Build `/employee/dashboard` page (self-service: profile, leave balance, requests, holidays, documents, notifications)
7. Protect HR-only routes (Settings → Users, Roles & Permissions, Audit Logs, etc.)
8. Redirect unauthorized access to appropriate dashboard

---

## HR DASHBOARD — MUST NOT REGRESS

| Feature | Status | Guardrails |
|---------|--------|------------|
| Navigation (sidebar, extended modules) | WORKING | Do not remove nav items |
| KPI cards (employees, onboarding, offboarding, leave, profile completion) | WORKING | Keep animated metrics |
| Workforce bar chart (departments) | WORKING | Keep `bar-chart` / `bar-group` classes |
| HR pulse (completion ring) | WORKING | Keep `pulse-ring` |
| Onboarding workflow steps | WORKING | Keep `workflow-step` + `step-icon` |
| Upcoming events panel | WORKING | Keep `event` + color classes |
| Recent activity panel | WORKING | Keep `activity` + `activity-icon` |
| Responsive grid (`dashboard-grid`) | WORKING | Test < 1024px |
| Dark / Light mode | WORKING | Verify all panels |
| EN / FR / AR | WORKING | Verify all text keys |

---

## CORE MODULE ROADMAP

### Dashboard
**Status: COMPLETED (HR)**  
- KPI cards, charts, workflow, events, activity all functional
- Uses inline HTML/CSS charts (not Recharts yet)
- **Remaining:** Consider Recharts for tooltips/legends; ensure mobile stacking

### Employees / People
**Status: COMPLETED**  
- Full directory table with search, status filter, pagination footer
- Employee drawer with all personal fields
- Status badges (Active, On Leave, Suspended)
- **Remaining:** Server-side pagination, column sorting, export CSV

### Onboarding
**Status: COMPLETED (UI only)**  
- Work-queue rows via `ModulePage` showing stage, progress, assignee
- Mock data in `mock.ts` (`onboardingRequests`)
- **Remaining:** Detail view per request, task checklist, equipment/apps assignment, stage transitions

### Offboarding
**Status: COMPLETED (UI only)**  
- Same pattern as Onboarding
- Mock data: `offboardingRequests`
- **Remaining:** Detail view, asset return tracking, exit interview, knowledge transfer

### Leave
**Status: COMPLETED (UI only)**  
- Work-queue rows: employee, type, dates, status, progress
- Mock data: `leaveRequests`, `leaveTypes`, `leaveBalances`
- **Remaining:** Employee self-service (my leave), balance calculation, approval flow, carry-over, half-day, Leave Types & Policies in Settings

### Holidays
**Status: COMPLETED (UI only)**  
- Work-queue rows: name, date, type, location
- Mock data: `holidays`
- **Remaining:** Year filter, country/site filter, recurring holidays, CRUD in Settings, leave calculation integration

### Documents
**Status: COMPLETED (UI only)**  
- Summary cards (total, expiring, missing)
- Table: document, employee, type, uploaded, expiry, status badge
- **Remaining:** Upload, download, expiry alerts, document types management, employee self-service

### Calendar
**Status: COMPLETED (UI only)**  
- Month grid, prev/next, view switch (Month/Week/Agenda)
- Hardcoded events (leadership sync, leave, holiday)
- **Remaining:** Data-driven events from leave/holidays/onboarding, click to create, week/agenda views, drag-resize

### Reports
**Status: COMPLETED (UI only)**  
- Headcount trend (inline line chart), department mix (donut + legend), leave trends (bar chart)
- **Remaining:** Real data, date filters, export PDF/CSV, Recharts migration for interactivity

### Settings
**Status: COMPLETED (Profile tab only)**  
- Sidebar menu with 15 items; only Profile renders content
- Profile: avatar, name, email, phone, language, theme, password
- **Remaining:** Implement all 14 remaining tabs (Account, Users, Roles & Permissions, Leave Types, Leave Policies, Onboarding Checklists, Offboarding Checklists, Equipment, Applications, Notifications, Languages, Appearance, Audit Logs)

---

## EMPLOYEE MODULE ROADMAP (not started)

| Page | Route | Scope |
|------|-------|-------|
| Employee Dashboard | `/employee/dashboard` | KPIs: my leave balance, pending requests, upcoming holidays, profile completion |
| Employee Profile | `/employee/profile` | Read-only personal info, editable phone/emergency contact |
| My Leave | `/employee/leave` | Balance, history, create request, cancel pending |
| My Holidays | `/employee/holidays` | Read-only list, filtered by location |
| My Documents | `/employee/documents` | My uploads, expiring, missing |
| My Notifications | `/employee/notifications` | Subset of HR notifications relevant to me |

**Constraints:** No HR admin features (no user management, no roles, no audit logs, no global leave policies).

---

## ADDITIONAL MODULES (Coming Soon placeholders)

| Module | Page | Status | Mock data |
|--------|------|--------|-----------|
| Recruitment | `/app/recruitment` | TODO (ComingSoon) | — |
| Attendance | `/app/attendance` | TODO (ComingSoon) | — |
| Performance | `/app/performance` | TODO (ComingSoon) | — |
| Training & Development | `/app/training` | TODO (ComingSoon) | — |
| Payroll & Compensation | `/app/payroll` | TODO (ComingSoon) | — |

**Decision:** Keep as placeholders until core HR + Employee dashboard are complete. Do not implement unless explicitly requested.

---

## UI / UX ROADMAP

| Element | Reference | Status |
|---------|-----------|--------|
| Colors (CSS variables in `App.css`) | `App_ORIGINAL` | PRESERVED |
| Typography (DM Sans / Space Grotesk) | `App_ORIGINAL` | PRESERVED |
| Spacing scale | `App_ORIGINAL` | PRESERVED |
| Cards (`panel`, `kpi-card`, `report-card`) | `App_ORIGINAL` | PRESERVED |
| Sidebar (collapsed, mobile drawer) | `App_ORIGINAL` | PRESERVED |
| Topbar (search, notifications, user menu) | `App_ORIGINAL` | PRESERVED |
| Buttons (primary, secondary, icon, link) | `App_ORIGINAL` | PRESERVED |
| Tables (sortable, hover, footer) | `App_ORIGINAL` | PRESERVED |
| Modals / Drawers (employee drawer) | `App_ORIGINAL` | PRESERVED |
| Animations (framer-motion, `sidebarLabels`) | `App_ORIGINAL` | PRESERVED |
| Dark mode | `App_ORIGINAL` | PRESERVED |
| Light mode | `App_ORIGINAL` | PRESERVED |
| Responsive breakpoints | `App_ORIGINAL` | PRESERVED (test < 1024px, < 640px) |
| Mobile sidebar behavior | `App_ORIGINAL` | PRESERVED |
| Arabic RTL | `App_ORIGINAL` | PRESERVED (`dir="rtl"` on `<html>` when `language === 'ar'`) |

**Rule:** When a new component visually differs from `App_ORIGINAL` without functional reason → compare → restore original classes → keep modular architecture.

---

## CHART ROADMAP

| Chart | Current | Target |
|-------|---------|--------|
| Headcount trend (line) | Inline `<span style="height:%">` | Recharts `LineChart` with tooltip, responsive container |
| Department mix (donut) | Inline HTML + CSS | Recharts `PieChart` with legend, labels |
| Leave trends (bar) | Inline `<i style="height:%">` | Recharts `BarChart` with X axis labels |
| Workforce overview (grouped bar) | Inline CSS bars | Recharts `BarChart` with grouped bars, legend |
| HR pulse (ring) | CSS conic gradient | Keep CSS (lightweight) or Recharts `RadialBarChart` |

**Constraints:** No fabricated data. Use `departments`, `employees`, `leaveRequests` from mock. Dark/light mode via CSS variables.

---

## INTERNATIONALIZATION

| Language | Code | Coverage | RTL |
|----------|------|----------|-----|
| English | `en` | Complete (base) | No |
| French | `fr` | Complete (nav, dashboard, common, auth) | No |
| Arabic | `ar` | Complete (nav, dashboard, common, auth) | **Yes** (`dir="rtl"` applied in `App.tsx`) |

**Translation system:** `I18nContext.tsx` exports `translations[lang]` (nav/module keys) + `phraseTranslations[lang]` (sentence fragments). Components call `text(key)`.

**Remaining:**
- Settings tabs (Profile, Account, Users, …) — only English strings in JSX
- Coming Soon module titles/descriptions — only in `navigation.ts` with EN keys
- Employee dashboard (when built) — new keys needed
- Ensure all new UI text uses `text()` not hardcoded strings

---

## SECURITY

| Area | Current | Gap |
|------|---------|-----|
| Authentication | Session flag in `sessionStorage` | No credentials, no token, no expiry |
| Role-based access | None (single `isAuthenticated` boolean) | Need `role` on user, route guards |
| Protected routes | `/app/*` only | No `/employee/*`, no per-route roles |
| HR permissions | Implicit (all authenticated = HR) | Must restrict Settings tabs by role |
| Employee permissions | N/A (route doesn't exist) | Must scope to own data only |
| Data isolation | N/A (mock data) | Future API must filter by user/role |
| Unauthorized handling | Redirect to `/login` | Should redirect to role-appropriate dashboard |
| Logout | Clears flag, navigates | OK |
| Session persistence | `sessionStorage` (tab-scoped) | OK for MVP; consider `localStorage` + expiry |

---

## CODE QUALITY

| Metric | Status |
|--------|--------|
| TypeScript errors | `tsc -b` passes |
| Oxlint | `npm run lint` passes (basic config) |
| Duplicate components | None detected |
| Dead code | `recharts`, `react-hook-form`, `zod`, `i18next`, `gsap`, `jquery` installed but unused |
| Large components | `AppLayout.tsx` (~200 lines), `PeoplePage.tsx` (~180), `DashboardPage.tsx` (~180) — acceptable |
| Reusable components | Good: `PageHeader`, `PanelTitle`, `ModulePage`, `KpiCard`, `StatusBadge`, `NotificationPanel` |
| Reusable hooks | None yet — consider `useAuth`, `useEmployees`, `useTranslations` |
| Repeated logic | Search/filter in `PeoplePage` only; mock data imported directly in pages |
| Folder structure | Flat under `pages/` and `components/` — acceptable for current size |

**Cleanup candidates:** Remove unused deps (`gsap`, `jquery`, `i18next`, `react-i18next`, `react-hook-form`, `zod`, `@hookform/resolvers`) unless needed for upcoming features.

---

## RULES FOR AI AGENTS

Before modifying code:
1. Read `AI_ROADMAP.md`
2. Inspect relevant existing implementation
3. Check whether feature already exists
4. Reuse existing components and logic
5. Check `App_ORIGINAL.tsx` when changing visual styling
6. Do not rewrite unrelated code
7. Do not create duplicate functionality
8. Do not change architecture unnecessarily
9. Preserve existing business logic
10. Preserve existing styling unless task explicitly requests UI change

After modifying code:
1. Run `npm run build` (typecheck + production build)
2. Fix all errors
3. Verify affected routes in browser
4. Verify responsive behavior (< 1024px, < 640px)
5. Verify dark / light mode
6. Verify EN / FR / AR
7. Verify RTL when `language === 'ar'`
8. Update `AI_ROADMAP.md`

---

## ROADMAP STATUS FORMAT

- `[COMPLETED]` — implemented, tested, working
- `[IN PROGRESS]` — actively being worked on
- `[TODO]` — planned, not started
- `[BLOCKED]` — waiting on dependency/decision
- `[FUTURE]` — out of scope for current phase

Per major feature include: **Status**, **Current state**, **Remaining work**, **Important files**

---

## TASK EXECUTION ORDER (default priority)

1. Fix broken functionality
2. Authentication and role-based access (HR vs Employee)
3. Core HR modules (complete Settings tabs, data-driven Calendar, Leave balances)
4. Employee dashboard (`/employee/dashboard` + self-service pages)
5. Component refactoring (extract hooks, reduce large components)
6. UI consistency (audit against `App_ORIGINAL`)
7. Charts (migrate to Recharts where valuable)
8. Internationalization (complete Settings, new modules)
9. Responsive / mobile improvements
10. Additional modules (Recruitment, Attendance, …)
11. Code cleanup (remove unused deps, dead code)

**User's explicit request always overrides this order.**

---

## CHANGE LOG

## Recent Changes

- **2026-09-25** — Restored visual parity with `App_ORIGINAL.tsx` across all modular components
  - LanguageSwitch: button group (EN/FR/ع) not select
  - LoginPage: two-column orbit visual, form wrap, security note, back link
  - AppLayout: original sidebar, topbar, main-shell classes
  - DashboardPage: KPIs, workforce chart, pulse, workflow, events, activity
  - PeoplePage: summary cards, table, filters, employee drawer
  - Module pages (Onboarding, Offboarding, Leave, Holidays): `ModulePage` work-queue
  - CalendarPage: month grid, toolbar, view switch
  - DocumentsPage: summary cards, table with status badges
  - ReportsPage: line chart, donut, bar charts (inline HTML/CSS)
  - SettingsPage: sidebar menu, profile tab
  - ComingSoon: illustration + badge
  - Landing navigation: `onNavigate` → `/login`
  - Files: `App.tsx`, `AppLayout.tsx`, `LoginPage.tsx`, `DashboardPage.tsx`, `PeoplePage.tsx`, `ModulePage.tsx`, all module pages, `LanguageSwitch.tsx`, `PageHeader.tsx`, `NotificationPanel.tsx`, `StatusBadge.tsx`, `ComingSoon.tsx`
  - Build: `npm run build` passes

- **2026-09-24** — Initial modular extraction from `App_ORIGINAL.tsx`
  - Created contexts, layout, common, dashboard, employees, notifications components
  - Created all page files under `src/pages/`
  - Routing in `App.tsx` updated to use modular pages
  - `App.css` preserved as design system

---

## AI WORKFLOW

Every AI agent working on this project should:

```
READ    → AI_ROADMAP.md
INSPECT → relevant existing code
IMPLEMENT → smallest clean change
TEST    → npm run build + manual route verification
VERIFY  → UI + routing + permissions + i18n + responsive
UPDATE  → AI_ROADMAP.md
```

Then continue to the next task.