# Auth Monorepo

Authentication app with an Express API (`server`) and React client (`client`), orchestrated with [Turborepo](https://turbo.build/) and [pnpm workspaces](https://pnpm.io/workspaces).

## Structure

```
packages/
├── auth/     @andrejground/auth — schema, migrations, auth library
├── server/   Express app (uses @andrejground/auth)
└── client/   React + Vite + Tailwind UI
docker-compose.yml   Postgres + Redis
turbo.json           Task pipeline (build, dev, typecheck, …)
```

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 11.8+ (this repo uses pnpm only — npm is blocked)

```bash
corepack enable
corepack prepare pnpm@11.8.0 --activate
```

- [Docker](https://www.docker.com/) (for local Postgres and Redis)

## Getting started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

```bash
cp packages/server/.env.example packages/server/.env
```

| Variable       | Description                  | Default                                            |
| -------------- | ---------------------------- | -------------------------------------------------- |
| `NODE_ENV`     | Runtime environment          | `development`                                      |
| `PORT`         | API server port              | `3000`                                             |
| `CLIENT_URL`   | React dev server origin      | `http://localhost:5173`                            |
| `DATABASE_URL` | PostgreSQL connection string | `postgres://postgres:postgres@localhost:5432/auth` |
| `REDIS_URL`    | Redis connection string      | `redis://localhost:6379`                           |

The server owns runtime env. Database migrations run in `@andrejground/auth` but read `DATABASE_URL` from `packages/server/.env` via root `dotenv-cli` scripts.

### 3. Start infrastructure

```bash
docker compose up -d
```

This starts Postgres 16 (`:5432`) and Redis 7 (`:6379`).

### 4. Run database migrations

```bash
pnpm db:migrate
```

Migrations are defined in `packages/auth` and applied to the database configured above.

### 5. Start dev servers

```bash
pnpm dev
```

- API: [http://localhost:3000](http://localhost:3000)
- Client: [http://localhost:5173](http://localhost:5173)

Quick health check:

```bash
curl http://localhost:3000/health
```

## Scripts

| Command                | Description                                           |
| ---------------------- | ----------------------------------------------------- |
| `pnpm dev`             | Start server and client (via Turbo)                   |
| `pnpm dev:server`      | Start API only                                        |
| `pnpm dev:client`      | Start client only                                     |
| `pnpm build`           | Build all packages (cached by Turbo)                  |
| `pnpm typecheck`       | Type-check all packages                               |
| `pnpm start`           | Run compiled server                                   |
| `pnpm db:generate`     | Generate migration in `@andrejground/auth`            |
| `pnpm db:migrate`      | Apply migrations in `@andrejground/auth`              |
| `pnpm db:studio`       | Open Drizzle Studio for `@andrejground/auth` schema   |
| `pnpm lint`            | Run ESLint                                            |
| `pnpm lint:fix`        | Run ESLint and auto-fix issues                        |
| `pnpm format`          | Format code with Prettier                             |
| `pnpm format:check`    | Check formatting with Prettier                        |

Root `db:*` commands load `packages/server/.env`, then run the matching script in `@andrejground/auth`.

## Client routes

| Path     | Page  | Access        |
| -------- | ----- | ------------- |
| `/login` | Login | Public        |
| `/`      | Home  | Authenticated |

Auth is scaffold-only on the client (localStorage flag). Wire it to server endpoints when ready.

The Vite dev server proxies `/api/*` to the API at `http://localhost:3000`.

## Server API

| Method | Path      | Description                     |
| ------ | --------- | ------------------------------- |
| `GET`  | `/`       | API welcome message             |
| `GET`  | `/health` | Health check (Postgres + Redis) |
| `GET`  | `/auth`   | Auth library router (scaffold)  |

## @andrejground/auth

The auth library owns the Drizzle schema and migrations:

```
packages/auth/
├── src/schema/       Table definitions
├── drizzle/          Migration SQL
└── drizzle.config.ts
```

### Current schema

**`users`**

| Column       | Type        | Notes              |
| ------------ | ----------- | ------------------ |
| `id`         | `uuid`      | Primary key        |
| `name`       | `text`      | Required           |
| `email`      | `text`      | Unique             |
| `password`   | `text`      | Hashed password    |
| `salt`       | `text`      | Password salt      |
| `role`       | `user_roles`| `admin` or `user`  |
| `created_at` | `timestamp` | Auto-set on insert |
| `updated_at` | `timestamp` | Auto-updated       |

After schema changes:

```bash
pnpm db:generate
pnpm db:migrate
```

### Import in an Express app

```typescript
import { createAuthRouter } from '@andrejground/auth';
import * as schema from '@andrejground/auth/schema';
```

### Migrations

```bash
# monorepo (loads packages/server/.env at the root)
pnpm db:migrate

# standalone / published package
DATABASE_URL=postgres://... pnpm --filter @andrejground/auth db:migrate
```

For published use, see `packages/auth/.env.example`.

### Publishing

```bash
pnpm --filter @andrejground/auth build
pnpm --filter @andrejground/auth publish
```

Remove `"private": true` from `packages/auth/package.json` before publishing.

## Production

```bash
pnpm build
pnpm start
```

Server runs the compiled API from `packages/server/dist`.

For the client:

```bash
pnpm --filter client build
pnpm --filter client preview
```

Set `DATABASE_URL`, `REDIS_URL`, and other env vars in your deployment environment before starting the server.
