# Apex CRM – Enterprise Client & Lead Management Platform

A high-performance CRM web application built with **Next.js App Router**, **Redux Toolkit**, and **Ant Design (AntD)**. Designed with enterprise architectural patterns, responsive layouts, data persistence via encrypted `localStorage`, XSS sanitization, and Content Security Policy (CSP).

---

## Key Features

- **Authentication & Protected Routes**: Mock authentication system with role support, session guards, and automated redirection.
- **Dynamic Dashboard**: Dynamic KPI statistics, conversion metrics, recent activity feeds, and latest customer tables computed in real-time via Redux selectors.
- **Customer Management**:
  - Full CRUD operations with modal forms.
  - Multi-field search and status filtering (`Active`, `Inactive`, `Lead`).
  - Column-based sorting and pagination.
  - Multi-row selection with bulk deletion.
  - Customer detail views (`/customers/[id]`) with notes, task linkage, and activity logs.
  - Instant CSV export.
- **Lead Pipeline & Auto-Conversion**:
  - Track lead stages (`New` → `Contacted` → `Follow-up` → `Qualified` → `Converted` / `Lost`).
  - Automatic conversion: Transitioning a lead to **Converted** generates an active Customer account and registers audit logs.
- **Task Management**:
  - Create, assign, prioritize (`High`, `Medium`, `Low`), and track tasks (`Todo` → `In Progress` → `Completed`).
  - Link tasks to specific customers or leads.
- **Security & Compliance**:
  - **DOMPurify** integration for automated input sanitization against XSS.
  - **AES-256 Encryption** for payload exchanges and `localStorage` persistence.
  - Strict **Content Security Policy (CSP)** and HTTP security headers.
- **Dark Mode & Theming**: Ant Design theme switching synchronized through Redux.

---

## Tech Stack

- **Framework**: Next.js (App Router)
- **UI Library**: Ant Design (AntD) + `@ant-design/nextjs-registry` + `@ant-design/icons`
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit & React-Redux
- **Data Persistence**: `localStorage` with AES-256 encryption (`crypto-js`)
- **Sanitization**: `isomorphic-dompurify`
- **Testing**: Jest & React Testing Library

---

## Getting Started

### 1. Prerequisites
- Node.js 18.x or higher
- npm or yarn

### 2. Installation
```bash
# Clone the repository
git clone <repository-url>
cd my-crm-ft

# Install dependencies
npm install