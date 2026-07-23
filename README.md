# 🤖 AutoQA Agent

> **AI-powered Autonomous QA Testing Platform**  
> Submit a URL. Let the AI explore your website like a senior QA engineer.

![Version](https://img.shields.io/badge/version-1.0.0-6366f1?style=flat-square)
![Status](https://img.shields.io/badge/status-scaffold-amber?style=flat-square)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

---

## 📐 Architecture

```
autoqa-agent/
├── client/               # ⚛️  React + Vite + TypeScript + Tailwind CSS
├── server/               # 🟢  Node.js + Express + TypeScript
├── playwright-engine/    # 🎭  Playwright Automation (scaffold)
├── shared/               # 📦  Shared types, constants, utilities
├── .env.example          # 🔐  Environment variable template
├── package.json          # 🗂️  npm workspaces root
└── README.md
```

### Monorepo Strategy

This project uses **npm workspaces** so all packages share a single `node_modules` at the root. Each package (`client`, `server`, `playwright-engine`, `shared`) is an independent unit with its own `package.json`, `tsconfig.json`, and scripts.

---

## 🚀 Quick Start

### Prerequisites

| Tool | Min Version |
|------|-------------|
| Node.js | 18.x |
| npm | 9.x |
| MongoDB | 6.x (local or Atlas) |

### 1. Clone & Install

```bash
git clone https://github.com/your-org/autoqa-agent.git
cd autoqa-agent
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Open `.env` and update these values:

```env
NODE_ENV=
PORT=5000
MONGODB_URI=
CORS_ORIGIN=

API_PREFIX=/api/v1
```

### 3. Start Development Servers

```bash
# Start both client and server concurrently
npm run dev

# Or start individually
npm run dev:server   # Express API  → http://localhost:5000
npm run dev:client   # Vite React  → http://localhost:5173
```

---

## 🗂️ Project Structure

### `/shared` — Shared Package

```
shared/src/
├── types/index.ts       # TypeScript interfaces (Scan, ScanResult, ApiResponse…)
├── constants/index.ts   # API routes, status labels, pagination defaults
└── utils/index.ts       # isValidUrl, formatDuration, timeAgo, buildPaginationMeta…
```

### `/server` — Express API

```
server/src/
├── config/
│   ├── environment.ts   # Validated env vars (dotenv)
│   ├── database.ts      # Mongoose connection manager
│   └── logger.ts        # Winston logger (console + daily rotate files)
├── controllers/
│   ├── scanController.ts
│   └── statsController.ts
├── middleware/
│   ├── errorHandler.ts  # Global error handler (ApiError, Zod, Mongoose)
│   ├── notFound.ts      # 404 middleware
│   ├── requestLogger.ts # HTTP request logger
│   └── validateRequest.ts # Zod validation factory
├── models/
│   └── Scan.ts          # Mongoose model with full schema & indexes
├── routes/
│   ├── index.ts         # Route aggregator + /health endpoint
│   ├── scanRoutes.ts    # /api/v1/scans
│   └── statsRoutes.ts   # /api/v1/stats
├── services/
│   ├── scanService.ts   # CRUD + Zod schemas
│   └── statsService.ts  # MongoDB aggregation pipelines
└── utils/
    ├── ApiError.ts      # Custom error class with factory helpers
    ├── asyncHandler.ts  # Async route wrapper (no try/catch boilerplate)
    └── responseHelpers.ts
```

### `/client` — React Dashboard

```
client/src/
├── components/
│   ├── ui/              # Button, Input, Badge, Card, Spinner, Table
│   ├── layout/          # Sidebar (collapsible), TopNav (breadcrumbs + status)
│   └── dashboard/       # StatsCards, ScanForm, RecentScansTable
├── hooks/
│   ├── useScans.ts      # TanStack Query hooks (CRUD + mutations)
│   └── useStats.ts      # Stats auto-refresh hook
├── layouts/
│   └── AppLayout.tsx    # Root layout (Sidebar + TopNav + Outlet)
├── pages/
│   ├── Dashboard.tsx
│   └── NotFound.tsx
├── services/
│   └── apiClient.ts     # Axios instance with interceptors
└── types/index.ts       # Client type extensions
```

### `/playwright-engine` — Automation Scaffold

```
playwright-engine/src/
├── agents/              # Future: QA orchestration agents
├── reporters/           # Future: HTML/JSON/Mongo reporters
└── index.ts             # Engine entry point (scaffold)
```

---

## 🔌 API Reference

### Health

```http
GET /api/v1/health
```

### Scans

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/scans` | Paginated list (`?page=1&limit=10&status=passed`) |
| `GET` | `/api/v1/scans/:id` | Single scan |
| `POST` | `/api/v1/scans` | Create scan `{ url, label? }` |
| `PATCH` | `/api/v1/scans/:id/cancel` | Cancel pending/running scan |
| `DELETE` | `/api/v1/scans/:id` | Delete scan |

### Stats

```http
GET /api/v1/stats
```

Returns real MongoDB aggregation: totalScans, passed, failed, running, pending, totalIssues, avgDuration.

---

## 🏗️ Dashboard Features

| Feature | Status |
|---------|--------|
| Dark glass-morphism UI | ✅ |
| Collapsible sidebar | ✅ |
| Breadcrumb top nav | ✅ |
| Live API connection indicator | ✅ |
| Stats cards (real DB data) | ✅ |
| URL scan form with validation | ✅ |
| Recent scans table | ✅ |
| Status filter tabs | ✅ |
| Pagination | ✅ |
| Cancel / Delete actions | ✅ |
| Auto-refresh (15s) | ✅ |
| React Query DevTools | ✅ dev only |
| AI scan engine | 🔜 future |
| Analytics charts | 🔜 future |
| Auth / multi-user | 🔜 future |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS v3 + custom dark palette |
| State / Data | TanStack Query v5 |
| HTTP Client | Axios |
| Routing | React Router v6 |
| Notifications | react-hot-toast |
| Icons | Lucide React |
| Backend | Express 4 + TypeScript |
| Database | MongoDB + Mongoose |
| Validation | Zod |
| Logging | Winston + daily-rotate-file |
| Automation | Playwright (scaffold) |
| Monorepo | npm workspaces |

---

## 📋 Available Scripts

From the **root**:

```bash
npm run dev           # Start client + server concurrently
npm run dev:server    # Server only
npm run dev:client    # Client only
npm run build         # Build all packages
npm run typecheck     # TypeScript check across packages
```

From **`server/`**:

```bash
npm run dev           # nodemon hot-reload
npm run build         # Compile TypeScript
npm run start         # Run compiled output
npm run typecheck     # tsc --noEmit
```

From **`client/`**:

```bash
npm run dev           # Vite dev server
npm run build         # Production build
npm run preview       # Preview production build
npm run typecheck     # tsc --noEmit
```

From **`playwright-engine/`**:

```bash
npm run test          # Run Playwright tests
npm run test:headed   # Run with browser UI
npm run test:ui       # Playwright UI mode
npm run codegen       # Record tests interactively
```

---

## 📁 Logs

Server logs are written to `logs/` in the project root:

```
logs/
├── autoqa-YYYY-MM-DD-combined.log   # All levels
└── autoqa-YYYY-MM-DD-error.log      # Errors only
```

Logs rotate daily and are kept for 14 days (error logs: 30 days).

---

## 🧩 Future Integration Points

The project is architected for easy extension:

1. **Playwright Engine** → `playwright-engine/src/agents/` for AI QA agents
2. **WebSocket** → Add `socket.io` to `server` for real-time scan progress
3. **Auth** → JWT middleware slot in `server/src/middleware/`
4. **AI** → OpenAI/Gemini API key slot in `.env.example`
5. **Analytics** → Chart components slot in `client/src/components/dashboard/`

---

## 📄 License

MIT © AutoQA Agent Team
