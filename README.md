# Quick Bill

Quick Bill is a full-stack invoicing app with a Node/Express + MongoDB backend and a React + Vite frontend. It supports client management, company settings, invoice creation, PDF export, dashboard stats, and logo uploads.

**Key Features**
- Dashboard with summary cards and recent activity
- Clients CRUD with ICE tracking
- Invoice creation with dynamic line items, VAT, discounts, preview, and PDF export
- Invoices list with search, filter, sort, edit, duplicate, delete, and CSV export
- Company settings with logo upload, VAT, currency, numbering, and business type
- Profile view/edit
- JWT authentication with protected dashboard routes

**Tech Stack**
- Backend: Node.js, Express, MongoDB (Mongoose)
- Frontend: React, Vite, Tailwind CSS
- Libraries: Axios, react-router-dom, @react-pdf/renderer, react-hot-toast, @tabler/icons-react

## Monorepo Structure

```
quick-bill/
├── backend/              # Express API
│   ├── server.js         # App entry
│   ├── example.env       # Environment template
│   ├── routes/           # auth, clients, invoices, settings, upload
│   ├── models/           # Mongoose schemas
│   ├── middleware/       # auth and upload helpers
│   └── config/dbconnect.js
└── frontend/             # React app (Vite)
    ├── src/              # App code, shared components, utilities
    ├── pages/            # Feature pages
    └── layouts/          # Public/Dashboard layouts
```

## Prerequisites
- Node.js 18+
- MongoDB (local or a connection string)

## Backend Setup

1. Copy `backend/example.env` to `backend/.env` and fill in your real values.

2. Install dependencies and start the server:
```powershell
cd "c:\Users\pc\Desktop\quick-bill\backend"
npm install
npm run dev
```

The API runs at `http://localhost:5000/api` by default.

To load sample data into MongoDB, run:
```powershell
cd "c:\Users\pc\Desktop\quick-bill\backend"
npm run seed
```

The seed script creates one demo user, two clients, and seven invoices with mixed `paid`, `pending`, and `overdue` statuses. It clears existing `users`, `clients`, `invoices`, and `settings` documents first, so use it only when you want a fresh sample dataset.

## Frontend Setup

1. Install dependencies:
```powershell
cd "c:\Users\pc\Desktop\quick-bill\frontend"
npm install
```

2. Start the React dev server:
```powershell
npm run dev
```

The app will open at the URL Vite prints (for this workspace it often falls back to `http://localhost:5174`).

## Configuration & Data

- Currency, VAT, invoice numbering, and logo settings are stored in MongoDB through the Settings page.
- Logo uploads use the backend upload route and are rendered in invoices and PDFs.
- Authentication token (JWT) is stored in `localStorage` and automatically added by `src/lib/api.js`.
- Some components keep derived UI state in `sessionStorage` when appropriate.

See `frontend/DATA_FLOW.md` for detailed component data flow.

## Useful Scripts

Backend (from `backend/`):
- `npm start`: start server
- `npm run seed`: reset and populate sample data

Frontend (from `frontend/`):
- `npm run dev`: start Vite dev server
- `npm run build`: production build
- `npm run preview`: serve the build locally
- `npm run lint`: run ESLint

## API Overview

Base URL: `http://localhost:5000/api`
- `POST /users/login`, `POST /users/register`
- `GET/PUT /users/profile`
- `GET/POST/PUT/DELETE /clients`
- `GET/POST/PUT/DELETE /invoices`
- `GET/PUT /settings`
- `POST /upload` for logo/image upload
- `GET /auth/verify-email/:token`

## Notes

- Ensure MongoDB is running and `MONGODB_URI` is correct.
- If ports are busy, update `PORT` in `.env` and `baseURL` in `frontend/src/lib/api.js`.
- Logo images are normalized before PDF generation so the invoice PDF can embed them reliably.
- Tailwind CSS is enabled via Vite plugin; dark mode styles are included across components.
