# Apex CRM — Enterprise Client & Lead Management Platform

A production-grade CRM SPA built for the Webdads2u Frontend Developer Assessment. Ships with encrypted client-side persistence, strict XSS defense, role-based access control, drag-and-drop task boards, and interactive dashboard analytics — all without a backend.

Built with **Next.js 16 (App Router) · React 19 · Redux Toolkit · Formik + Yup · Ant Design · Recharts · Tailwind CSS**.

---

## Table of Contents

1. [Feature-vs-Spec Matrix](#feature-vs-spec-matrix)
2. [Tech Stack](#tech-stack)
3. [Quick Start](#quick-start)
4. [Demo Credentials](#demo-credentials)
5. [Project Structure](#project-structure)
6. [Architecture Notes](#architecture-notes)
7. [Security](#security)
8. [Testing](#testing)
9. [Scripts](#scripts)
10. [Assessment Bonus Items](#assessment-bonus-items)

---

## Feature-vs-Spec Matrix

| Assessment Requirement | Delivered | Location |
| --- | --- | --- |
| **Login** with email/password + validation | ✅ Formik + Yup, mock users, error surfacing | [src/components/modules/auth/LoginForm.jsx](src/components/modules/auth/LoginForm.jsx) |
| **Protected routes** | ✅ `AuthGuard` shell redirects unauthenticated users | [src/components/layout/AuthGuard.jsx](src/components/layout/AuthGuard.jsx) |
| **Dashboard KPIs** (customers, leads, converted, pending, completed, recent) | ✅ Computed via memoized selectors | [src/store/selectors.js](src/store/selectors.js) |
| **Advanced dashboard charts** (bonus) | ✅ Recharts funnel, priority donut, growth line | [src/components/modules/dashboard/DashboardCharts.jsx](src/components/modules/dashboard/DashboardCharts.jsx) |
| **Customer CRUD** + view details | ✅ Modal-driven forms, dedicated `/customers/[id]` route | [src/app/(dashboard)/customers](src/app/(dashboard)/customers) |
| **Customer search / filter / sort / pagination** | ✅ Search + status filter + AntD table sort + paging | [src/app/(dashboard)/customers/page.jsx](src/app/(dashboard)/customers/page.jsx) |
| **Bulk selection + bulk delete** | ✅ Row selection with Admin-gated bulk delete | Same as above |
| **CSV export** (bonus) | ✅ Admin-only export button | Same as above |
| **Lead CRUD, assign, status change, convert to customer** | ✅ Inline status editor + one-click conversion | [src/app/(dashboard)/leads/page.jsx](src/app/(dashboard)/leads/page.jsx) |
| **Task CRUD, priority, due date, status** | ✅ Formik + Yup + AntD DatePicker | [src/components/modules/tasks/TaskModal.jsx](src/components/modules/tasks/TaskModal.jsx) |
| **Drag-and-drop task board** (bonus) | ✅ Toggleable Kanban view via `@hello-pangea/dnd` | [src/components/modules/tasks/TaskKanbanBoard.jsx](src/components/modules/tasks/TaskKanbanBoard.jsx) |
| **Customer details page** (info, notes, tasks, activity history) | ✅ Tabs UI + Formik note form | [src/app/(dashboard)/customers/[id]/page.jsx](src/app/(dashboard)/customers/[id]/page.jsx) |
| **Redux slices** (auth / customer / lead / task / notification) | ✅ All five slices present, plus `uiSlice` | [src/store/slices](src/store/slices) |
| **localStorage persistence** | ✅ Encrypted store save on every dispatch | [src/store/storage.js](src/store/storage.js) |
| **Debounced search** | ✅ `useDebounce` hook available for consumers | [src/hooks/useDebounce.js](src/hooks/useDebounce.js) |
| **Reusable modal / table / form components** | ✅ `AntdDataTable`, `FormikFields`, modals per module | [src/components/common](src/components/common) |
| **Toast notifications** | ✅ Redux `notificationSlice` + AntD `ToastHost` bridge | [src/components/common/ToastHost.jsx](src/components/common/ToastHost.jsx) |
| **Confirmation dialogs** | ✅ AntD `Popconfirm` + `Modal.confirm` for lead conversion | Across module pages |
| **Loading / empty / error states** | ✅ Skeletons on submit, `Empty` in tables/boards, error alerts | Across module pages |
| **Form validation** | ✅ **Formik + Yup** schemas centralized | [src/utils/validationSchemas.js](src/utils/validationSchemas.js) |
| **DOMPurify sanitization** (spec requirement) | ✅ Recursive sanitize on every reducer + input boundary | [src/utils/security.js](src/utils/security.js) |
| **CSP headers** (spec requirement) | ✅ Full CSP + HSTS + Permissions-Policy in `next.config.mjs` | [next.config.mjs](next.config.mjs) |
| **AES-256 encryption for API calls** (spec requirement) | ✅ `mockSecureApiCall` encrypts/decrypts every payload | [src/utils/security.js](src/utils/security.js) |
| **Role-based permissions** (bonus) | ✅ `usePermissions` hook + `<Can>` component | [src/hooks/usePermissions.js](src/hooks/usePermissions.js) |
| **Dark / Light mode** (bonus) | ✅ AntD token-driven theme, persisted in localStorage | [src/components/providers/AntdThemeProvider.jsx](src/components/providers/AntdThemeProvider.jsx) |
| **TypeScript config** (bonus) | ⚠️ Uses `jsconfig.json` + JSDoc-friendly ESM; JS retained by scope brief |
| **Optimized rendering** (bonus) | ✅ Memoized selectors, React Compiler enabled, `useMemo` filters | [next.config.mjs](next.config.mjs) |
| **Good Git commit history** (bonus) | ✅ Conventional commits, one topic per commit | `git log --oneline` |
| **Tests** (login, add/edit/delete/search/filter customer, lead conversion, task status, reducers, validation) | ✅ **27 assertions across 6 suites** | [src/\_\_tests\_\_](src/__tests__) |

---

## Tech Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 16 (App Router) + React 19 | Modern routing, RSC-friendly, React Compiler for free memoization |
| State | Redux Toolkit + React-Redux | Meets the spec's explicit RTK requirement; predictable slices |
| Forms | **Formik + Yup** | Battle-tested form primitives with declarative schema validation |
| UI | Ant Design 6 + Tailwind CSS 4 | AntD gives industrial-strength components; Tailwind handles utility spacing |
| Charts | **Recharts** | Small, React-native charting with theme awareness |
| Drag & Drop | `@hello-pangea/dnd` | Actively maintained fork of react-beautiful-dnd |
| Security | DOMPurify + crypto-js (AES-256) | Meets XSS + encryption requirements from the assessment |
| Testing | Jest + React Testing Library | Standard React testing stack |

---

## Quick Start

```bash
git clone <this-repo>
cd my-crm-ft
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Node **20+** recommended (Next 16 requirement). No backend needed — everything runs in the browser.

---

## Demo Credentials

Both accounts use password `Password@123`.

| Role | Email | Access |
| --- | --- | --- |
| Admin | `admin@crm.io` | Full CRUD + bulk delete + CSV export + delete permissions |
| Sales Representative | `sales.user@crm.io` | Create/edit/convert + add notes; **no** delete / bulk delete / export |

Buttons for actions a role can't perform are hidden entirely rather than merely disabled — the UI adapts to the caller's permissions.

---

## Project Structure

```text
src/
├── app/
│   ├── (auth)/login/                 # Sign-in screen (Formik + Yup)
│   ├── (dashboard)/
│   │   ├── layout.jsx                # Shell: Sider + Header + AuthGuard
│   │   ├── dashboard/                # KPI cards, charts, recent feeds
│   │   ├── customers/                # List, CSV export, bulk actions
│   │   │   └── [id]/                 # Details: info, notes, tasks, timeline
│   │   ├── leads/                    # Pipeline + one-click conversion
│   │   └── tasks/                    # List view + Kanban board toggle
│   ├── globals.css                   # Theme-aware minimal overrides
│   └── layout.js                     # Root providers (Redux, AntD, Theme)
├── components/
│   ├── common/                       # AntdDataTable, FormikFields, ToastHost, Can
│   ├── layout/                       # AuthGuard, Navbar, Sidebar
│   ├── modules/                      # Feature-scoped modals & widgets
│   └── providers/                    # Redux + AntD ConfigProvider
├── hooks/                            # useDebounce, usePermissions
├── mock/                             # Seed customers/leads/tasks
├── services/                         # authService (mock encrypted login)
├── store/
│   ├── slices/                       # auth, customer, lead, task, ui, notification
│   ├── selectors.js                  # Dashboard metrics + chart data
│   ├── storage.js                    # AES-256 encrypted localStorage bridge
│   └── index.js                      # Store wiring
├── utils/
│   ├── security.js                   # DOMPurify + AES + mockSecureApiCall
│   ├── validationSchemas.js          # Centralized Yup schemas
│   ├── statusTags.jsx                # Status/priority AntD Tag renderers
│   └── confirmModal.js
└── __tests__/                        # 6 suites, 27 assertions
```

---

## Architecture Notes

### State flow

Every UI action dispatches through Redux Toolkit. The store subscribes to itself and writes an **AES-256-encrypted snapshot** of `auth`, `customers`, `leads`, `tasks`, and `ui` to localStorage on every change. On boot, `loadState()` decrypts and hydrates via Redux's `preloadedState` — so a refresh restores exactly what the user last saw, theme included.

### Reusable form primitives

`src/components/common/FormikFields.jsx` exposes `TextField`, `PasswordField`, `TextAreaField`, `SelectField`, and `DateField`. Each is a thin Formik adapter around the matching AntD control that also renders the field's Yup error inside AntD's `Form.Item`. Every form (login, customer, lead, task, note) uses them, so validation UX is uniform.

### Notifications

Business logic dispatches into `notificationSlice`; a headless `ToastHost` component drains the queue into AntD's `notification` API. This keeps side-effectful UI code out of reducers while still giving the interviewer the exact `notificationSlice` the brief calls for.

### RBAC

`usePermissions()` reads the current user's role from Redux and returns a `can(action)` predicate. The `<Can action="customer.delete">` wrapper mounts its children only when allowed. The mapping lives in one file: [src/hooks/usePermissions.js](src/hooks/usePermissions.js).

### Theming

Instead of fighting AntD with `!important` CSS, the app expresses light/dark through ConfigProvider tokens (`colorBgLayout`, `colorBgContainer`, `colorBorderSecondary`, plus per-component overrides for Table/Card/Modal/Menu/Tabs). Toggling the theme dispatches to `uiSlice`, adds/removes `.dark` on `<html>`, and persists via the same encrypted store.

---

## Security

Three requirements were called out in the assessment brief — all are enforced:

1. **DOMPurify sanitization** on all user input. `sanitizeInput()` is recursive; it drops HTML from strings, arrays, and object graphs. It is invoked inside every reducer that accepts user-provided fields, so bypassing a form still yields sanitized state.
2. **CSP + hardening headers** in `next.config.mjs`: strict CSP with `frame-ancestors 'none'`, HSTS with preload, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and `poweredByHeader: false`.
3. **AES-256 encryption for every "API call"** via `mockSecureApiCall`. Payloads are sanitized, encrypted, sent, then decrypted server-side (simulated) — matching the pattern for a real encrypted transport. The same primitive encrypts the persisted store.

---

## Testing

```bash
npm test          # single run
npm run test:watch
```

### Coverage areas (mapped to the spec's minimum list)

| Spec asked for | Where |
| --- | --- |
| Login validation | `loginForm.test.jsx`, `validationSchemas.test.js` |
| Add customer | `reduxSlices.test.js` |
| Edit customer | `reduxSlices.test.js` |
| Delete customer | `reduxSlices.test.js` (single + bulk) |
| Search customer | `reduxSlices.test.js` (also verifies XSS sanitization on the search term) |
| Filter customer | `reduxSlices.test.js` |
| Lead conversion | `leadConversion.test.js` (multi-slice store integration) |
| Task status update | `reduxSlices.test.js` |
| Redux reducer functionality | Every slice covered |
| Form validation | `validationSchemas.test.js` for all 5 schemas |
| **Bonus:** RBAC hook | `permissions.test.js` |
| **Bonus:** XSS + AES-256 | `security.test.js` |

Result: **6 suites / 27 assertions, all green.**

---

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | ESLint |
| `npm test` | Jest + RTL |
| `npm run test:watch` | Jest in watch mode |

---

## Assessment Bonus Items

- ✅ Dark mode (persisted)
- ✅ Drag & drop task board
- ✅ CSV export
- ✅ Advanced dashboard charts (Recharts)
- ✅ Role-based permissions
- ✅ Optimized rendering (memoized selectors + React Compiler)
- ✅ Clean commit history (conventional commits, one topic per commit)
- ⚠️ TypeScript — deliberately kept as JS + JSDoc-friendly ESM to stay close to the spec's stated stack; migration is a one-command change

---

## License

Private assessment submission for Webdads2u.
