# FlowForm

FlowForm is a form builder monorepo: create forms with optional start/end dates, publish shareable links, and collect submissions from respondents without accounts.

## Stack

- **Monorepo:** [Turborepo](https://turborepo.com) + [pnpm](https://pnpm.io)
- **Web:** [Next.js](https://nextjs.org) 16, React 19, Tailwind CSS 4, [tRPC](https://trpc.io) + TanStack Query
- **API:** Express 5, tRPC (OpenAPI via `trpc-to-openapi`), Scalar API reference
- **Data:** PostgreSQL, [Drizzle ORM](https://orm.drizzle.team)

## Repository layout

| Path | Description |
|------|-------------|
| `apps/web` | Next.js app — marketing site, auth, dashboard, public form pages |
| `apps/api` | HTTP server exposing tRPC at `/trpc` |
| `packages/database` | Drizzle schema, migrations, `db:generate` / `db:migrate` |
| `packages/trpc` | Shared tRPC routers (`auth`, `form`) and client utilities |
| `packages/services` | Business logic (users, forms, submissions) |
| `packages/logger` | Shared logging |
| `packages/eslint-config`, `packages/typescript-config` | Shared tooling configs |

## Features

- Email/password sign-up and sign-in (JWT in HTTP-only cookies)
- Dashboard to create and manage forms
- Form fields (text, textarea, email, number, select, radio, checkbox, date, etc.)
- Publish forms and share a public link at `/f/{formId}`
- Optional **start** and **end** dates — submissions only accepted while the form is open
- Landing page (features, pricing, FAQ, and related sections)

## Prerequisites

- Node.js **18+**
- [pnpm](https://pnpm.io) **9** (see `packageManager` in root `package.json`)
- Docker (for local PostgreSQL)

## Getting started

### 1. Start PostgreSQL

```sh
docker compose up -d
```

This runs Postgres 15 on port **5432** with database `dev`, user `postgres`, password `postgres` (see `docker-compose.yml`).

### 2. Environment variables

Create a `.env` file at the **repository root**. The `setup.sh` script symlinks it into `apps/*` and `packages/*` so all workspaces share the same values.

```env
# Database (matches docker-compose defaults)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dev

# Auth (use a long random string in production)
JWT_SECRET=your-dev-jwt-secret

# Web → API (optional; defaults to http://localhost:8000/trpc)
NEXT_PUBLIC_API_URL=http://localhost:8000/trpc

# API server (optional)
PORT=8000
NODE_ENV=development
```

Run the setup helper (creates `.env` from `.env.example` when that file exists, otherwise link your `.env`):

```sh
chmod +x setup.sh
./setup.sh
```

### 3. Migrate the database

```sh
pnpm db:migrate
```

To generate new migrations after schema changes:

```sh
pnpm db:generate
```

### 4. Run development servers

```sh
pnpm dev
```

| Service | URL |
|---------|-----|
| Web | http://localhost:3000 |
| API / tRPC | http://localhost:8000/trpc |

Open Drizzle Studio from the database package:

```sh
pnpm --filter @repo/database dev
```

## Web routes

| Route | Purpose |
|-------|---------|
| `/` | Marketing / landing |
| `/sign-in`, `/sign-up` | Authentication |
| `/dashboard` | Overview |
| `/dashboard/forms` | Form list and management |
| `/f/[formId]` | Public form (fill & submit; no account required) |

## Scripts

From the repo root:

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in dev mode (loads `.env` via `dotenv-cli`) |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint across the monorepo |
| `pnpm check-types` | TypeScript check |
| `pnpm db:migrate` | Apply Drizzle migrations |
| `pnpm db:generate` | Generate Drizzle migrations from schema changes |
| `pnpm format` | Prettier write |

Filter to a single app:

```sh
pnpm exec turbo dev --filter=web
pnpm exec turbo dev --filter=@repo/api
```

## API overview

tRPC procedures live under `packages/trpc/server/routes/`:

- **Authentication** — register, sign in, session (`getLoggedInUserInfo`)
- **Forms** — CRUD, fields, publish, public read, submit, submission stats

The API app also serves OpenAPI documentation (Scalar) when running in development.

## Production notes

- Set strong `JWT_SECRET` and a production `DATABASE_URL`.
- Point `NEXT_PUBLIC_API_URL` at your deployed API’s `/trpc` endpoint.
- Run `pnpm build` and start `apps/web` with `next start` and `apps/api` with its `start` script after building the API bundle.

## License

Private project — see repository settings for license terms if applicable.
