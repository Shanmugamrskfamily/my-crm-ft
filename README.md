# Apex CRM – Enterprise Client & Lead Management Platform

An enterprise-grade CRM web application built with **Next.js (App Router)**, **Redux Toolkit**, and **Ant Design (AntD)**. Designed with persistent client-side data synchronization via AES-256 encrypted storage, strict XSS sanitization, and a dynamic analytics dashboard.

---

## Features

### 1. Authentication & Protected Routes
* Mock authentication system supporting role-based access (**Admin** and **Sales Representative**).
* Client-side session routing guards with automated redirection.
* Quick demo login presets on the sign-in screen.

### 2. Dashboard Analytics & Dynamic Metrics
* Real-time computed KPIs (Total Customers, Total Leads, Converted Leads, Win Rate %, Pending Tasks).
* Interactive recent activities feed tracking customer creation, updates, notes, and conversions.
* Quick-view table for latest customer registrations with direct profile access.

### 3. Customer Management Module
* Complete CRUD operations powered by modal interfaces.
* Multi-field real-time search across names, companies, emails, and locations.
* Filter by status (`Active`, `Inactive`, `Lead`) with custom badge tags.
* Multi-row selection with bulk deletion confirmation.
* Single-click CSV data export.
* Comprehensive Customer Details view (`/customers/[id]`) featuring customer contact overview, timestamped note logs, linked task tracking, and audit timelines.

### 4. Lead Pipeline & Auto-Conversion
* Track prospects across pipeline stages: `New` → `Contacted` → `Follow-up` → `Qualified` → `Converted` / `Lost`.
* **Automated Customer Provisioning:** Transitioning a lead to **Converted** automatically triggers creation of an active account in the Customer directory with initial activity logs.

### 5. Task Management
* Create, assign, prioritize (`High`, `Medium`, `Low`), and update task progress (`Todo` → `In Progress` → `Completed`).
* Link tasks directly to specific customers or leads with contextual navigation.
* Multi-dimensional filtering by priority and workflow status.

### 6. Security & UI Theming
* **DOMPurify Input Sanitization:** Automatic recursive stripping of malicious HTML/JS payloads across all form submissions.
* **AES-256 Storage & Payload Encryption:** Client-side encryption (`crypto-js`) for sensitive data persistence.
* **Dark / Light Mode:** Synchronized Ant Design theme engine with Nunito typography across all screens.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js (App Router), React |
| **UI & Icons** | Ant Design (AntD), `@ant-design/nextjs-registry`, `@ant-design/icons` |
| **Styling** | Tailwind CSS, Nunito Google Font |
| **State Management** | Redux Toolkit, React-Redux |
| **Security** | DOMPurify, Crypto-JS (AES-256) |
| **Testing** | Jest, React Testing Library, `@testing-library/jest-dom` |

---

## Project Structure

```text
my-crm-ft/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.jsx           # Sign-in screen
│   │   ├── (dashboard)/
│   │   │   ├── layout.jsx             # Shell layout (Sidebar, Navbar, Theme toggle)
│   │   │   ├── dashboard/
│   │   │   │   └── page.jsx           # KPI metrics & Activity feed
│   │   │   ├── customers/
│   │   │   │   ├── page.jsx           # Customer management & CSV export
│   │   │   │   └── [id]/
│   │   │   │       └── page.jsx       # Customer profile, notes, & timeline
│   │   │   ├── leads/
│   │   │   │   └── page.jsx           # Lead pipeline & conversion
│   │   │   └── tasks/
│   │   │       └── page.jsx           # Task tracking & assignments
│   │   ├── globals.css                # Global stylesheet & AntD overrides
│   │   ├── layout.jsx                 # Root layout (Redux, Theme, Font setup)
│   │   └── page.jsx                   # Root redirect controller
│   ├── components/
│   │   ├── common/                    # Shared reusable tables & inputs
│   │   ├── layout/                    # AuthGuard & Navigation bars
│   │   ├── modules/                   # Feature-specific modals and widgets
│   │   └── providers/                 # Redux & AntD ConfigProviders
│   ├── mock/                          # Seed datasets for initial state
│   ├── store/
│   │   ├── slices/                    # Auth, Customer, Lead, Task, UI slices
│   │   ├── selectors.js               # Memoized Redux metric selectors
│   │   └── index.js                   # Redux store & LocalStorage persistence
│   ├── utils/                         # AES encryption, DOMPurify, and status tags
│   └── __tests__/                     # Unit & integration test suites
├── jest.config.js                     # Jest testing configuration
├── jest.setup.js                      # DOM & matchMedia testing mocks
└── README.md