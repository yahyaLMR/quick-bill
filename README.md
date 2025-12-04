# Quick Bill

Quick Bill is a full‑stack invoicing application with a Node/Express + MongoDB backend and a React + Vite frontend. It lets you manage clients, configure company settings, create invoices with VAT and discounts, and view dashboards and statistics.

**Live Features**
- Dashboard with summary cards, recent activity, and revenue chart
- Clients CRUD with ICE tracking
- Invoice creation with dynamic line items, VAT, discounts, preview, and PDF
- Invoices list with filter/search/sort, edit/duplicate/delete, CSV export
- Settings for company info, VAT, currency, numbering, business type
- Profile view/edit and quick stats
- Authentication (JWT) with protected dashboard routes

**Tech Stack**
- Backend: Node.js, Express, MongoDB (Mongoose)
- Frontend: React, Vite, Tailwind CSS
- Libraries: Axios, react-router-dom, @react-pdf/renderer, react-hot-toast, @tabler/icons-react

## Monorepo Structure

```
quick-bill/
├── backend/              # Express API
│   ├── server.js         # App entry
│   ├── routes/           # auth, clients, invoices, settings
│   ├── models/           # Mongoose schemas
│   ├── middleware/       # auth, upload
│   └── config/dbconnect.js
└── frontend/             # React app (Vite)
	├── src/              # App code (router, components)
	├── pages/            # Feature pages
	└── layouts/          # Public/Dashboard layouts
```

## Prerequisites
- Node.js 18+
- MongoDB (local or a connection string)

## Backend Setup

1. Create the environment file `backend/.env` with values like:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/quick-bill
JWT_SECRET=replace_with_a_strong_secret
```

2. Install dependencies and start the server:
```powershell
cd "c:\Users\pc\Desktop\final project\quick-bill\backend"; npm install; npm run start
```

The API will run at `http://localhost:5000/api`.

## Frontend Setup

1. Install dependencies:
```powershell
cd "c:\Users\pc\Desktop\final project\quick-bill\frontend"; npm install
```

2. Start the React dev server:
```powershell
npm run dev
```

The app will open at the URL Vite prints (e.g. `http://localhost:5173`).

## Configuration & Data

- Currency and VAT are configured in the Settings page and read by the InvoiceForm, Invoices, and Dashboard.
- Authentication token (JWT) is stored in `localStorage` and automatically added by `src/lib/api.js` to requests.
- Some components may store derived UI state in `sessionStorage` when appropriate.

See `frontend/DATA_FLOW.md` for detailed component data flow.

## Useful Scripts

Backend (from `backend/`):
- `npm start`: start server

Frontend (from `frontend/`):
- `npm run dev`: start Vite dev server
- `npm run build`: production build
- `npm run preview`: serve the build locally
- `npm run lint`: run ESLint

## API Overview

Base URL: `http://localhost:5000/api`
- `POST /auth/login`, `POST /auth/register`
- `GET/POST/PUT/DELETE /clients`
- `GET/POST/PUT/DELETE /invoices`
- `GET/PUT /settings`

## Notes
- Ensure MongoDB is running and `MONGO_URI` is correct.
- If ports are busy, update `PORT` in `.env` and `api.baseURL` in `frontend/src/lib/api.js` accordingly.
- Tailwind CSS is enabled via Vite plugin; dark mode styles are included across components.
