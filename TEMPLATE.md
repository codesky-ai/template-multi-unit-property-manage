# Multi-Unit Property Manage

> An enterprise portal for managing multiple real estate assets. Includes modules for tracking tenant leases, automating maintenance requests across different cities or compounds, and generating financial or tax reports.

<div dir="rtl"><b>نظام إدارة العقارات والوحدات السكنية</b> — بوابة مؤسسية لإدارة الأصول العقارية المتعددة. تتضمن وحدات لتتبع عقود إيجار المستأجرين، وأتمتة طلبات الصيانة عبر مدن أو مجمعات سكنية مختلفة، وإنشاء تقارير مالية وضريبية.</div>

`multi-unit-property-manage` · saas · 39 files · generated from the CodeSky template gallery

## What this is

Multi-Unit Property Manage is an enterprise template for real estate portfolios spanning multiple locations. It provides lease tracking, maintenance workflows, and financial reporting through a React frontend and Express backend connected to MySQL. Property managers overseeing apartments, commercial spaces, or mixed-use developments across cities would start here.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18.2.0 + Vite |
| Backend | Node + Express |
| Database | SQL schema included |
| Tests | none |
| Container | none |

## Architecture

The frontend is a React 18 application built with Vite and styled with Tailwind CSS. It communicates with a Node/Express backend through an API client and also references mock data structures for development. The backend exposes route modules for properties, units, tenants, owners, contracts, maintenance requests, and payments, though only health and root endpoints are currently wired. State lives in a MySQL database defined by a seven-table schema covering owners, properties, units, tenants, leases (contracts), maintenance tickets, and payment records. Seed data populates sample entities to demonstrate multi-property hierarchies and cross-location operations. The backend declares environment variables for database credentials, email configuration, JWT secrets, file uploads, and locale settings, but authentication and email workflows are not yet implemented.

### Layout

```
backend/.env.example
backend/README.md
backend/package.json
backend/src/app.ts
backend/src/config/database.ts
backend/src/controllers/dashboardController.ts
backend/src/controllers/ownerController.ts
backend/src/controllers/propertyController.ts
backend/src/controllers/tenantController.ts
backend/src/controllers/unitController.ts
backend/src/routes/contracts.ts
backend/src/routes/dashboard.ts
backend/src/routes/index.ts
backend/src/routes/maintenance.ts
backend/src/routes/owners.ts
backend/src/routes/payments.ts
backend/src/routes/properties.ts
backend/src/routes/tenants.ts
backend/src/routes/units.ts
backend/src/server.ts
backend/tsconfig.json
database/README.md
database/schema.sql
database/seed.sql
frontend/index.html
frontend/package.json
frontend/postcss.config.js
frontend/src/App.tsx
frontend/src/api/client.ts
frontend/src/api/mockData.ts
frontend/src/index.css
frontend/src/main.tsx
frontend/src/services/apiService.ts
frontend/src/types/index.ts
frontend/src/utils/rtl.ts
frontend/tailwind.config.js
frontend/tsconfig.json
frontend/tsconfig.node.json
frontend/vite.config.ts
```

### Data model

Tables defined in the SQL schema:

- `contracts`
- `maintenance_requests`
- `owners`
- `payments`
- `properties`
- `tenants`
- `units`

### API surface

```
GET    /
GET    /api/health
```

## Running it

```bash
# frontend
cd frontend && npm install && npm run dev

# backend
cd backend && npm install && npm run dev
```

Configuration is read from an `.env` file. Copy `.env.example` and set:

- `DB_HOST`
- `DB_NAME`
- `DB_PASSWORD`
- `DB_USER`
- `EMAIL_HOST`
- `EMAIL_PASSWORD`
- `EMAIL_PORT`
- `EMAIL_USER`
- `FRONTEND_URL`
- `JWT_SECRET`
- `LOCALE`
- `MAX_FILE_SIZE`
- `NODE_ENV`
- `PORT`
- `SESSION_SECRET`
- `TIMEZONE`
- `UPLOAD_PATH`

## What is next

1. **Implement authentication and authorization** — JWT_SECRET and SESSION_SECRET are defined but no login, registration, or role-based access control exists to secure tenant, owner, and manager portals.
2. **Wire backend route handlers** — Controllers and route files are present but only health-check endpoints respond; CRUD logic for properties, units, leases, maintenance, and payments must be connected.
3. **Replace mock data with live API calls** — The frontend references mockData.ts, indicating the UI is not yet consuming real backend endpoints for rendering property and tenant information.
4. **Add automated tests** — The backend lists a test script and Jest dependency but has_tests is false, leaving business logic and API contracts unvalidated.
5. **Build file upload and email features** — UPLOAD_PATH, MAX_FILE_SIZE, and email configuration keys are declared but no middleware or service handles document attachments or tenant notifications.
6. **Configure CI/CD and containerization** — No Docker setup or deployment pipeline exists to streamline staging and production rollouts across cloud providers.
7. **Remove or secure seed data** — database/seed.sql populates demo records that should not reach production; migrate to fixtures or environment-gated seeding.

---

<sub>Exported from the CodeSky template gallery. Generated code — review before production use. <a href="https://codesky.ai">codesky.ai</a></sub>
