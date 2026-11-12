# Dashly Admin

A responsive, bilingual (English / Persian with full RTL) admin dashboard built with **React, Vite and Tailwind CSS v4**.

**Live demo:** _add your Vercel link here_

> Demo sign-in: `admin@dashly.dev` / `admin123` (the login page has a "Fill in" button)

<!-- Add 2-3 screenshots here: light, dark and Persian/RTL -->
<!-- ![Dashboard](docs/dashboard.png) -->

## Features

- **eCommerce dashboard** with statistics, orders / profit / earnings widgets, a revenue report chart with year selector, an "increase budget" form, a companies table and a sales goal card
- **Users management**: server-style search, role and status filters, sortable columns, pagination, and create / edit / delete with validation and duplicate-email errors
- **Authentication**: login with validation, "remember me" (localStorage vs sessionStorage), protected routes that return you to the page you came from, and sign-out
- **Profile**: edit personal info with dirty-state detection, change password with current-password check
- **Settings**: theme, language, saved notification preferences, and a two-step "reset demo data"
- **Header tools**: command-style search (Ctrl/⌘ + K), cart, notifications with read/unread state, bookmarks, language and theme switchers
- **Light / dark theme** and **English / Persian** with automatic RTL layout and Persian (Jalali) date formatting
- Loading skeletons, error states with retry, toasts, and keyboard-accessible controls (ARIA roles, focus states)

## Tech stack

| Area      | Choice                                          |
| --------- | ----------------------------------------------- |
| Framework | React 19 + Vite (JavaScript)                    |
| Styling   | Tailwind CSS v4 with CSS-variable design tokens |
| Routing   | React Router v7 (nested routes, route guards)   |
| Data      | TanStack Query v5 over a mock async API layer   |
| Charts    | Recharts                                        |
| i18n      | i18next + react-i18next (en / fa, RTL)          |
| Icons     | lucide-react                                    |

## Architecture

```
src/
  app/          providers (theme, toast), router
  components/
    layout/     sidebar, navbar, shell
    ui/         shared primitives (Card, Modal, Dropdown, Switch, TextField ...)
  config/       navigation (single source of truth for sidebar and search)
  features/     one folder per feature: api / hooks / components / pages
    auth/ dashboard/ users/ profile/ settings/ cart/ notifications/ search/
  hooks/        useLocalStorage, useDebouncedValue
  i18n/         setup and locale files
  lib/          formatting, helpers, query client
```

Design decisions worth noting:

- **Mock API shaped like a real backend.** Every feature talks to async functions in its `api/` folder (latency, filtering, sorting, pagination and error codes included). TanStack Query hooks sit on top, so replacing the mocks with real `fetch` calls only touches the `api/` files.
- **Theming through CSS variables.** Components use semantic utilities (`bg-card`, `text-heading`, `border-border`), and dark mode swaps the variables, so components rarely need `dark:` classes.
- **RTL by design.** Layout uses logical properties (`ps-`, `ms-`, `start-`) and the `rtl:` variant; charts are rendered in an LTR container so axes stay correct.
- **Accessible UI.** Sortable tables expose `aria-sort`, switches use `role="switch"`, form errors use `role="alert"` and are linked with `aria-describedby`.

## Getting started

```bash
git clone https://github.com/aida20051383/dashly-admin.git
cd dashly-admin
npm install
npm run dev
```

Build for production with `npm run build` and preview it with `npm run preview`.

## Notes

- All data is mocked and lives in memory, so it resets on reload. Sign-in sessions are stored in the browser.
- The visual style is inspired by modern admin templates. All code, the logo and the illustrations are original.
