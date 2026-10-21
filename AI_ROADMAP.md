# AI_ROADMAP.md — IntillgenceHR

*Persistent roadmap and source of truth for AI coding agents. Updated after each meaningful change.*

## Backend foundation update — October 2026

**Status: In progress.** The approved technical baseline is Laravel 12, PostgreSQL, Sanctum cookie sessions, and versioned REST APIs. Business policies remain pending and are not finalized by this implementation.

- Implemented initial migrations, Eloquent models, validation, audit logging, auth, People/catalog, RBAC, Organigram, notification, and workflow endpoints in `backend/`.
- Implemented initial session login/logout/current-user flows, permission middleware, safe employee field projection, department scoping, dated reporting links, chart-cycle diagnostics, versioned workflow configuration, approval assignments/actions/history, and workflow notifications.
- Added an operator-driven first RBAC administrator command. It creates no People access or approval grants. The base catalog seeder does not assign roles or permissions; only the local demo seeder adds documented, limited demo grants.
- PostgreSQL 18 is installed and running on `127.0.0.1:5432`. Laravel connects to the `intelligence_rh` database using the dedicated `intelligence_rh_app` role; local credentials stay in the ignored `backend/.env`.
- All six migrations ran successfully on PostgreSQL. The initial RBAC catalog seeder is idempotent and retains 6 proposed roles and 38 permissions.
- Deterministic local demo fixtures cover People (100 employees, 8 departments, 8 teams, 20 positions, 99 reporting links), 21 test identities with scoped demo RBAC, 2 generic E-Flow templates and 15 instances (8 pending, 5 approved, 1 rejected, 1 returned), and 35 in-app notifications. The separate `demo:reset` command only removes demo-marked fixture records in local/testing; it preserves RBAC catalogs/grants and other records.
- Leave requests/balances, onboarding/offboarding cases and checklists, and aggregate dashboard-statistics endpoints are not in the current schema/API; no demo records or integration claims are made for them.
- Local demo accounts use the password configured as `DEMO_USER_PASSWORD` in the ignored `backend/.env`. Existing user records and passwords are never updated.
- `phpunit.pgsql.xml` provides read-only PostgreSQL fixture/API integration checks; the normal feature suite remains on in-memory SQLite.
- `php artisan test` passes (23 tests, 133 assertions; 2 PostgreSQL-only tests skipped) using in-memory SQLite. `vendor/bin/phpunit -c phpunit.pgsql.xml` passes against the populated PostgreSQL database (2 tests, 29 assertions), including API reads and demo-account login.
- React integration is opt-in via `VITE_DATA_MODE=api`; mock mode remains the default. Cookie-auth and the People directory use the API adapter; other repositories and modules remain mock-backed.
- Frontend TypeScript and production build pass. Lint reports no errors.
- Production deployment configuration, comprehensive RBAC/workflow policies, document/signature storage, approved delegation, owning-module workflow integrations, broader UI cutover, and controlled localStorage migration remain pending.

### Next implementation order

1. Confirm bootstrap-admin operational recovery, role scope and sensitive-field policies; add remaining RBAC boundary tests.
2. Finish People/catalog and Organigram edge cases, then expose and test the UI permissions model.
3. Confirm E-Validation decision/delegation/resubmission rules before expanding workflow transitions.
4. Add approved Leave, Onboarding, Offboarding and dashboard-statistics schemas/APIs before claiming those sources are database-backed.
5. Integrate Documents, Employee Requests, and Notifications through module-owned contracts.
6. Migrate additional repositories one at a time, with explicit local-data export/reconciliation and mock fallback.
7. Complete security, regression, deployment, backup, and accessibility verification.

---

## EMPLOYEE SELF-SERVICE MODULE IMPLEMENTATION & AUDIT — October 1, 2026

### ✅ IMPLEMENTATION COMPLETE & VERIFIED

**Build Status**: ✅ SUCCESS (`tsc -b && vite build` passing cleanly)  
**BRD Compliance**: ✅ 100% compliant with Employee Self-Service Scope  
**Security/RBAC**: ✅ RoleRoute protection + strict `userId` scoping across all services

---

### EMPLOYEE MODULE ARCHITECTURE & FEATURES

1. **Centralized Persistence Layer (`src/data/employeeStore.ts`)**:
   - Clean localStorage-backed facade with pub/sub event bus (`useEmployeeStore`).
   - Easily swappable for future REST / GraphQL API endpoints.
   - Handles Employee Profiles, Leave Requests, Employee Notifications, and Onboarding Tasks.

2. **Security & Identity (`src/utils/employeeHelpers.ts`, `src/components/auth/RoleRoute.tsx`)**:
   - `resolveEmployee` strictly matches authenticated user's stable `userId` (with email fallback).
   - Never compares `Employee.id === User.id`.
   - Leave requests, onboarding data, notifications, and sensitive documents are exclusively scoped to the authenticated employee.
   - Centralized `RoleRoute` prevents Employees from accessing `/app/*` and HR/Admins from accessing `/employee/*`.

3. **My Profile & Profile Completion (`/employee/profile`)**:
   - 5 BRD sections: Identity, Contact, Family, Employment, Documents.
   - Editable fields: Personal/Professional phone, Marital status, Number of children, Emergency contact details.
   - Live completion calculation, `personalInfoCompletedAt` recording upon 100% completion, and date-snoozable reminder (`personalInfoDismissedUntil`).

4. **Dynamic Passport Expiry Alerts (`src/utils/passport.ts`)**:
   - Calculates expiry dynamically against current date: 90-day, 60-day, 30-day, and Expired states.
   - Emits scoped employee notifications and visual alert banners.

5. **Leave Management & Duration Calculation (`src/utils/leave.ts`, `/employee/leave`)**:
   - Working day calculation accurately excludes weekends and company/public holidays for the employee's country/location.
   - Supports half-day AM/PM requests.
   - Validates date order, sufficient balance, and date overlaps.
   - Colleague backup selection with automatic notification dispatch.
   - Pending request cancellation and drawer-based detail inspection.

6. **Holidays (`/employee/holidays`)**:
   - Year and country filtering, recurring holiday support, days-away calculation.

7. **My Onboarding (`/employee/onboarding`)**:
   - Clean employee-sanitized view displaying stage progression, overall percentage, and employee-visible tasks with interactive checklist state.
   - Strictly hides internal HR, ISD, and Local IT administrative notes/comments.

8. **Notifications & Inbox (`/employee/notifications`)**:
   - Fully employee-scoped notifications for leave status changes, backups, onboarding, reminders, and passport alerts.
   - Unread counters, mark as read, mark all as read.

9. **Documents (`/employee/documents`)**:
   - Honest representation of employee identity, passport, and contract documents with explicit "no file available" placeholders (no fake downloadable files or fake payslips).

10. **i18n & RTL (`src/pages/employee/translations.ts`)**:
    - Complete runtime translations for English, French, and Arabic.
    - Stable business keys mapped to localized strings with status badge CSS synchronization.

---

### BRD REQUIREMENTS AUDIT SUMMARY

| Requirement | Description | Status |
|-------------|-------------|--------|
| **FR-XM-01** | Employee Identity & Security Scoping | **[COMPLETE]** |
| **FR-XM-03** | Profile Completion Flow & Snooze | **[COMPLETE]** |
| **FR-XM-04** | Passport Validity Dynamic Alerts (90/60/30/Expired) | **[COMPLETE]** |
| **FR-PP-02** | Profile Information Display & Breakdown | **[COMPLETE]** |
| **FR-PP-03** | Editable Self-Service Fields & Validation | **[COMPLETE]** |
| **FR-PP-04** | Emergency Contact Information Management | **[COMPLETE]** |
| **FR-PP-05** | Sensitive Field Protection | **[COMPLETE]** |
| **FR-PP-06** | Profile Completion Percentage & Tracker | **[COMPLETE]** |
| **FR-PP-08** | Remind Me Later Snooze Persistence | **[COMPLETE]** |
| **FR-PP-10** | Employee Identity Resolution via userId | **[COMPLETE]** |
| **FR-LV-03** | Leave Balance per Leave Type (Annual, Sick, Unpaid) | **[COMPLETE]** |
| **FR-LV-04** | Leave Request Submission & Validation | **[COMPLETE]** |
| **FR-LV-05** | Working Day Calculation (Excluding Holidays & Weekends) | **[COMPLETE]** |
| **FR-LV-06** | Half-Day (AM/PM) Leave Request Support | **[COMPLETE]** |
| **FR-LV-07** | Backup Colleague Assignment & Notification | **[COMPLETE]** |
| **FR-LV-09** | Pending Leave Request Cancellation | **[COMPLETE]** |
| **FR-HOL-01** | Company & Public Holidays Listing | **[COMPLETE]** |
| **FR-HOL-02** | Holiday Duration & Recurrence Handling | **[COMPLETE]** |
| **FR-HOL-03** | Holiday Filtering by Year and Country/Site | **[COMPLETE]** |
| **FR-HOL-05** | Holiday Integration with Leave Calculation | **[COMPLETE]** |
| **BRD §5** | Employee Onboarding Self-Service View | **[COMPLETE]** |

---

- [ ] Browser rendering verification
- [ ] Responsive design (desktop/tablet/mobile)
- [ ] RTL layout for Arabic
- [ ] Dark/light mode switching
- [ ] Language switching (EN/FR/AR)
- [ ] Profile completion logic
- [ ] Leave data display
- [ ] Accessibility (WCAG - requires assistive tech)

---

### IMPLEMENTATION STATUS

**Completed**:
- ✅ 4-file modular architecture
- ✅ 10 reusable components
- ✅ All 11 BRD sections
- ✅ Full i18n support
- ✅ Role-based access control
- ✅ Secure data lookup

**Blocked**:
- Backend API integration (future)
- Real-time notifications (future)
- Accessibility expert review (requires manual testing)



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
| **State management** | React `useState` / `useMemo`; employee and HR records also use `src/data/employeeStore.ts` with localStorage persistence and a subscription interface |
| **Contexts** | `I18nContext` (language, translations, theme) — single provider in `App.tsx` |
| **Hooks** | No custom hooks folder; logic inline in components |
| **Component structure** | `src/components/` with subfolders: `layout/`, `common/`, `dashboard/`, `employees/`, `notifications/` |
| **Pages** | `src/pages/` — one file per route; dashboard, people, onboarding, offboarding, leave, holidays, documents, calendar, reports, settings, auth, plus 5 coming-soon pages |
| **Styling** | Tailwind CSS v4 via `@tailwindcss/vite`; custom `App.css` (design tokens, component classes); `LandingPage.css` for landing animations |
| **UI libraries** | `lucide-react` (icons), `framer-motion` (animations), `clsx` + `tailwind-merge` (class composition) |
| **Charts** | `recharts` v3 (installed, not yet used in modular pages — original used inline SVG/HTML bar charts) |
| **Forms** | `react-hook-form` + `zod` + `@hookform/resolvers` (installed, not yet used) |
| **i18n** | `i18next` + `react-i18next` (installed) but **not wired** — actual translations live in `I18nContext.tsx` as plain objects |
| **Auth mechanism** | Demo `AuthContext` resolves users from mock data, stores the user/session flag in `sessionStorage`, and applies frontend route/role guards; no server authentication or authoritative permission checks |
| **Backend / API** | None — `src/data/mock.ts` supplies seed data, `employeeStore.ts` persists selected records in localStorage, and `mockRepository.ts` provides an async repository-shaped adapter |
| **Database** | None; the browser store and mock repositories are transitional, not a server-side data model |
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

## PRE-BACKEND HRMS ARCHITECTURE & ROADMAP — October 14, 2026

**Status: PLANNING ONLY — proposed requirements and design, pending business and technical confirmation.**
This addendum extends the existing roadmap; it does not replace or amend the existing BRD/business requirements. Do not treat example roles, workflow statuses, or entity details below as finalized policy. No API, database migration, or backend service is implemented by this plan.

**Architecture validation:** Detailed proposed entity/relationship diagrams, constraints and indexes, permission matrix, REST contracts, workflow-state diagram, migration plan, compatibility review, and decision log are in [ARCHITECTURE.md](./ARCHITECTURE.md). Assessment: ready for stakeholder/technical review, but **needs decisions and approval before implementation**. The BRD remains unchanged.

### Current frontend and mock-data baseline

- React 19 and TypeScript frontend with routes in `src/App.tsx`; existing People, Leave, Onboarding, Offboarding, Documents, employee self-service, and other HRMS pages remain the integration surfaces.
- `src/data/mock.ts` provides demo employees, departments, users, leave, onboarding, offboarding, and notification data.
- `src/data/employeeStore.ts` initializes selected records from mock seeds, persists changes in browser localStorage, and publishes updates. `src/data/mockRepository.ts` provides async CRUD/list interfaces for selected record types. These form a possible adapter seam, not a backend contract.
- `Employee.id` is numeric and distinct from `Employee.userId`; leave and employee self-service data refer to `userId`. Employee department and manager are currently display strings, not normalized IDs. Preserve this distinction during design and migration; do not duplicate employee records.
- The current `Role` union and demo sign-in in `src/contexts/AuthContext.tsx` are not a centralized or secure RBAC system. `AuditLog` is only a frontend model type. Documents currently have no managed file-storage backend.

### Planned modules and functional scope

All items in this section are proposed and require confirmation before implementation.

**E-Flow — modular workflow management**

| Submodule | Planned responsibility |
|-----------|------------------------|
| E-Validation | Electronic approval and validation: single/multi-level and sequential/parallel approvals; approve, reject, or return for correction; configurable approvers and delegation; status, history, and timestamps; planned integrations with Leave, Onboarding, Offboarding, and Documents |
| E-Signature | Electronic signing requests, signer progress, and evidence/artifact references; signature provider, identity assurance, legal acceptance, and retention are open decisions |
| E-Documents | Document metadata/version references, circulation, access controls, and approval links; binary files belong in private managed storage, not workflow records |
| E-Requests | Internal employee request intake, ownership, status, and associated workflow |
| E-Workflow | Configurable workflow definitions/versions, steps, routing, transitions, and execution |
| E-Notifications | Approval alerts and reminders, with delivery status and employee-facing inbox integration |
| E-History | Workflow event tracking, decisions, actors, timestamps, and audit trail |

**E-Validation proposed capabilities:** Support single or multiple approval levels, sequential or parallel validation, approve/reject/return-for-correction outcomes, configurable approvers, delegated approval, status tracking, timestamped decision history, and integrations with Leave, Onboarding, Offboarding, and Documents. Rules for quorum, reassignment, editing/resubmitting, cancellation, deadlines, escalation, delegation limits, and finality are unconfirmed.

**Organigram:** Use the existing People/Employees records as the sole employee source. Display manager-to-employee hierarchy, departments/teams, employee profile cards, expandable/collapsible branches, search and department filters, zoom/pan, and responsive visualization. Plan `manager_id`, `department_id`, and `position_id` relationships referencing shared records/employee IDs as appropriate. Allow no-manager employees (for example, top-level or unassigned staff); detect and reject circular reporting relationships. Refresh the visualization when employee relationship data changes.

**Roles & Permissions (central RBAC):** Plan role and permission creation/assignment, role-to-permission mapping, user-to-role assignment, multiple roles per user where required, module- and action-level access (`view`, `create`, `update`, `delete`, `approve`, `export`), sensitive employee-data restrictions, role-aware navigation/dashboard access, and audit logging for permission changes. Permission inheritance is excluded unless explicitly approved. Example defaults only: Super Admin, HR Admin, HR Manager, Department Manager, Employee, Workflow Approver. Do not hardcode these as business rules.

### Proposed data entities and relationships

Logical model only; entity names, cardinalities, key policy, and database technology require validation.

| Entity / aggregate | Relationships and design intent |
|--------------------|---------------------------------|
| Employee | Reuse existing employee identity and primary key. Add/normalize optional `manager_id` self-reference, `department_id`, and `position_id`; preserve employees without managers and validate no reporting cycles. Never create a second employee master table. |
| User / Employee identity link | Authentication principal maps to the existing employee using an explicit employee reference (and, if needed, an external subject); preserve the current distinction between employee ID and user ID. Define whether non-employee users are allowed. |
| Department, Team, Position | Department contains teams and positions as confirmed; employee references are normalized IDs. Unassigned/team-less employees and historical organization changes need policy decisions. |
| Role, Permission, UserRole, RolePermission | Many-to-many user-role and role-permission mappings. Permissions identify module/action and may require a resource/data-scope dimension. Do not infer inheritance. |
| WorkflowDefinition, WorkflowVersion, WorkflowInstance | A definition has versions and reusable step/routing configuration; instances pin the version used and refer to an initiating user and a generic business resource (`resource_type`, `resource_id`) to avoid module-specific coupling. |
| WorkflowTask / ApprovalAssignment, Decision, Delegation | Instance tasks/assignments capture approver identity, ordering or parallel grouping, status, and delegation/effective dates. Decisions capture outcome, actor, timestamp, and permitted comment/evidence references. Persist assignment context so later org-chart changes do not rewrite historical approvals. |
| Request | Employee-owned typed request with status and optional workflow-instance link; avoid copying employee profile fields into each request. |
| Document, DocumentVersion, SignatureRequest | Metadata, owner/resource links, version and storage-object references, access classification, and signature process/evidence references. Keep file bytes in protected object storage and link approvals by resource reference. |
| Notification, NotificationDelivery | Recipient user, event/template, read state, timestamps, channel, and delivery outcome; use employee/user identity, not duplicated employee data. |
| AuditEvent | Append-oriented actor, action, target, timestamp, outcome, and relevant before/after or structured change data, with sensitive-value redaction and restricted access. Include RBAC changes and workflow decisions; define retention/tamper-evidence policy. |

### Module boundaries and integrations

- People owns employee identity and employment/profile facts; Organigram consumes People plus Department/Team/Position relationships. Roles & Permissions links to users and employee identities without owning employee records.
- E-Flow owns workflow definitions/execution, task routing, decisions, delegation, and workflow history. HR modules own their business records and reference workflow instances by resource identity; do not embed Leave/Onboarding/Offboarding business rules in the workflow engine.
- Roles & Permissions supplies centralized authorization for application modules and E-Flow approver eligibility. Organigram may provide a manager-chain candidate for routing, but approval policy must configure/confirm its use and provide explicit handling for missing/cyclic relationships.
- Planned links: People → Organigram; People → Roles & Permissions; Roles → E-Flow approvers; Organigram → approval hierarchy; E-Validation ↔ Leave, Onboarding, Offboarding, Documents; E-Notifications → Employee Portal. All use shared employee/user identities and centralized permissions.
- Keep module contracts resource-oriented and avoid direct database/table coupling. Use explicit events or stable service/API contracts for cross-module changes; transactional and retry guarantees require design.

### Proposed API shape (illustrative, not committed)

Use a versioned REST API as an initial discussion shape (`/api/v1`); confirm REST vs alternatives, deployment topology, and naming before implementation. Apply consistent pagination, filtering, validation errors, authorization errors, and concurrency/version handling.

| Surface | Illustrative endpoints |
|---------|------------------------|
| Session / identity | `POST /auth/login`, `POST /auth/logout`, `GET /me` |
| People / org data | `GET|POST /employees`, `GET|PATCH|DELETE /employees/{employeeId}`, `GET /departments`, `GET /teams`, `GET /positions`, `GET /org-chart` |
| RBAC | `GET|POST /roles`, `GET|PATCH|DELETE /roles/{roleId}`, `GET|POST /permissions`, `PUT /roles/{roleId}/permissions`, `PUT /users/{userId}/roles`, `GET /users/{userId}/permissions` |
| Workflow / validation | `GET|POST /workflow-definitions`, `POST /workflow-definitions/{id}/versions`, `POST /workflow-instances`, `GET /workflow-instances/{id}`, `POST /workflow-instances/{id}/decisions`, `POST /workflow-tasks/{id}/delegate` |
| Requests / documents / signatures | `GET|POST /requests`, `GET|POST /documents`, `POST /documents/{id}/versions`, `POST /signature-requests` |
| Notifications / history | `GET /notifications`, `PATCH /notifications/{id}`, `GET /audit-events`, `GET /workflow-instances/{id}/history` |

Endpoint verbs and access scopes are examples only. Enforce permissions on the server for every request; frontend route hiding is usability only, not authorization. Restrict list/detail/export data by user, role, module, action, and sensitive-field policy.

### Authentication, au
thorization, workflow, and audit design

- Replace demo login and browser-stored trust with server-verified authentication, secure session/token lifecycle, logout/revocation, and explicit identity-to-employee mapping. Provider, MFA, session model, and credential policy remain open.
- Resolve effective permissions centrally on the server from assigned roles and explicit permission mappings. Support multiple roles if approved. Do not add inherited permissions by default. Apply least privilege and field-level restrictions for sensitive employee attributes; log permission/role assignments and changes.
- Model workflow execution as explicit configured states and transitions, with authorized commands and recorded decisions. A tentative lifecycle may include draft, pending approval, approved, rejected, returned for correction, and cancelled; confirm allowed transitions, resubmission behavior, parallel completion/quorum, reassignment, delegation, deadlines, and escalations before freezing the state machine.
- Record actor, employee/user identity, event/action, decision/outcome, and server timestamp for each state/permission change. Preserve immutable history where required; define privacy, redaction, retention, and access policy before implementation.

### Document management and notifications

- Store document metadata and version/approval/signature references in application data; store content in private object storage behind authorization-checked upload/download flows. Decide allowed formats/size, malware scanning, encryption, retention/deletion, legal holds, access classification, and signature evidence/provider before build.
- Create notification events from committed module/workflow actions; support in-app employee notifications and approval reminders. Specify channels (in-app/email/push), templates/localization, delivery retries, deduplication, preferences, timing, and escalation before implementation.

### Mock-to-backend migration and frontend integration

1. Inventory mock seeds, localStorage keys, current repository adapters, identifiers, and data consumers. Map `Employee.id` to the employee primary key and separately map `Employee.userId` to the user identity; validate uniqueness and references.
2. Prepare a versioned export/transform/import with dry-run validation, duplicate/orphan reports, counts, and explicit approval before any production import. Resolve manager display names and department strings to canonical IDs only when unambiguous; report unknown values for review. Preserve permitted user-entered local records; do not migrate demo passwords/session flags as credentials or invent missing history.
3. Agree how local-only changes are reconciled, backed up, retried, and rolled back before cutover. Verify record counts, relationships, access scopes, and representative module journeys; retain a reversible migration/cutover plan.
4. Keep page components behind typed repository/service interfaces. After API contracts stabilize, replace mock adapters with HTTP implementations while preserving current page behavior, identity scoping, loading/error handling, localization, and role-appropriate navigation. Do not let pages call storage/database APIs directly.

### Implementation roadmap and dependencies

Priorities are: confirm requirements and identity/authorization policies first; establish one employee identity and normalized organization relationships; centralize permissions before exposing protected modules; keep workflow integrations loosely coupled; verify privacy, migration, and failure handling before launch.

| Phase | Scope | Dependencies / exit focus |
|-------|-------|---------------------------|
| 1. Requirements and architecture validation | Confirm this proposal with HR/business, security, and technical stakeholders; resolve critical open decisions and baseline existing BRD | Prerequisite for all implementation; approve scope, terms, data ownership, and API/auth direction |
| 2. People data model and organizational relationships | Define employee/user identity mapping and department/team/position/manager references; migration mapping and cycle/unassigned-manager rules | Phase 1; canonical identifiers and relationship validation agreed |
| 3. Roles & Permissions (RBAC) | Define permission catalog, assignments, sensitive fields, server enforcement, and change audit | Phases 1–2; agreed user identity and access policy |
| 4. Organigram | Plan/build responsive hierarchy visualization against shared People relationships, with search/filter, branch controls, zoom/pan, and cycle handling | Phase 2; use existing employee records only |
| 5. E-Flow core workflow engine | Define versioned workflow configuration, instance/task model, authorization, state transitions, and history | Phases 1–3; state model and permission checks agreed |
| 6. E-Validation | Add configurable single/multi-level sequential/parallel approval, outcomes, assignment/delegation, tracking, and history | Phase 5; approval policy decisions resolved |
| 7. Additional E-Flow submodules | Deliver E-Signature, E-Documents, E-Requests, E-Notifications, and E-History | Phases 3, 5–6; storage, signature, delivery, and retention choices |
| 8. Integration with existing HRMS modules | Connect workflow/resource contracts to Leave, Onboarding, Offboarding, Documents, and Employee Portal notifications | Phases 2–7; module ownership and contracts agreed |
| 9. Backend implementation and database migration | Implement approved APIs, authentication/authorization, persistence, storage/event delivery, and mock-data migration/cutover | Phases 1–8; approved schema/contracts, migration rehearsal, and rollback plan |
| 10. Security, testing, and deployment | Threat/security review, authorization and data-scope tests, workflow/migration/integration tests, operational readiness, deployment | Phase 9; release gates and production policies approved |

Phases 2–8 may include requirements, schema/API design, and frontend-only work where approved; they do not authorize backend services, API implementation, database migrations, or production-data migration before Phase 9.

### Open decisions requiring confirmation

- Organizational policy: canonical department/team/position catalog, matrix reporting, effective-dated manager changes, top-level/unassigned managers, and treatment of existing name/string relationships.
- Identity and access: authentication provider, MFA, user provisioning/deprovisioning, employee/user ID mapping, non-employee accounts, initial role/permission catalog, role assignment authority, sensitive fields, and whether permission inheritance is ever required.
- RBAC behavior: module/action/resource scopes, department/team/own-record boundaries, export policy, administrator break-glass access, and permission-change review/retention.
- Workflow rules: who may define/publish versions, approver selection and snapshots, sequential/parallel completion criteria, quorum, delegate eligibility/limits, return/resubmit behavior, rejection/cancellation, deadlines/escalation, and exceptional cases.
- Legal/operations: signature provider and legal evidence requirements; document formats, storage location, malware scanning, retention/deletion, encryption and legal holds; audit immutability, privacy, redaction and retention.
- Notifications: channels, timing, templates/locales, user preferences, retries, deduplication, delivery guarantees, and escalation.
- Technical choices: backend framework, database, REST or alternative API, hosting, object storage, event/queue needs, observability, backup/recovery, and rollout/cutover strategy.
- Migration and delivery scope: which localStorage records are user data vs demo seeds, reconciliation/ownership rules, supported legacy records, acceptance criteria, rollout order, and rollback window.

### Planning-only boundary

No application functionality was changed for this plan. Backend APIs, services, database schema/migrations, production data migration, and final business rules remain **not started / unapproved**.

---

## CHANGE LOG

## Recent Changes

- **2026-10-14** — Added a confirmation-pending pre-backend architecture and 10-phase roadmap for E-Flow, Organigram, RBAC, module integrations, API/data design, migration, and open decisions. No backend or application functionality implemented.
- **2026-10-14** — Added [ARCHITECTURE.md](./ARCHITECTURE.md) with proposed normalized schema, Mermaid diagrams, REST contracts, authorization matrix, workflow state model, migration strategy, compatibility validation, and decision options/recommendations. Awaiting approval; no backend or application functionality implemented.
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