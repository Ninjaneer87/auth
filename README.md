# Auth API

A Node.js authentication API built with Express, Drizzle ORM (PostgreSQL), and Redis.

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 11+ (`corepack enable` to activate)
- [Docker](https://www.docker.com/) (for local Postgres and Redis)

## Getting started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

Copy the example env file and adjust values if needed:

```bash
cp .env.example .env
```

| Variable       | Description                  | Default                                            |
| -------------- | ---------------------------- | -------------------------------------------------- |
| `NODE_ENV`     | Runtime environment          | `development`                                      |
| `PORT`         | HTTP server port             | `3000`                                             |
| `DATABASE_URL` | PostgreSQL connection string | `postgres://postgres:postgres@localhost:5432/auth` |
| `REDIS_URL`    | Redis connection string      | `redis://localhost:6379`                           |

### 3. Start infrastructure

```bash
docker compose up -d
```

This starts:

- **Postgres 16** on port `5432`
- **Redis 7** on port `6379`

### 4. Run database migrations

```bash
pnpm db:migrate
```

### 5. Start the dev server

```bash
pnpm dev
```

The API will be available at [http://localhost:3000](http://localhost:3000).

## Scripts

| Command             | Description                            |
| ------------------- | -------------------------------------- |
| `pnpm dev`          | Start dev server with hot reload       |
| `pnpm build`        | Compile TypeScript to `dist/`          |
| `pnpm typecheck`    | Type-check without emitting `dist/`    |
| `pnpm start`        | Run compiled production build          |
| `pnpm db:generate`  | Generate migration from schema changes |
| `pnpm db:migrate`   | Apply pending migrations               |
| `pnpm db:studio`    | Open Drizzle Studio (database browser) |
| `pnpm lint`         | Run ESLint                             |
| `pnpm lint:fix`     | Run ESLint and auto-fix issues         |
| `pnpm format`       | Format code with Prettier              |
| `pnpm format:check` | Check formatting with Prettier         |

## API

| Method | Path      | Description                     |
| ------ | --------- | ------------------------------- |
| `GET`  | `/`       | API welcome message             |
| `GET`  | `/health` | Health check (Postgres + Redis) |

Example:

```bash
curl http://localhost:3000/health
# {"status":"ok","checks":{"database":"ok","redis":"ok"}}
```

## Project structure

```
src/
├── index.ts          # Entry point, graceful shutdown
├── app.ts            # Express app setup
├── config/
│   └── env.ts        # Environment validation (Zod)
├── db/
│   ├── index.ts      # Drizzle client
│   └── schema/       # Table definitions
├── redis/
│   └── index.ts      # Redis client
└── routes/
    └── health.ts     # Health check route
```

## Database

Schema lives in `src/db/schema/`. After making changes:

```bash
pnpm db:generate   # create migration in drizzle/
pnpm db:migrate    # apply to database
```

### Current schema

**`users`**

| Column          | Type        | Notes              |
| --------------- | ----------- | ------------------ |
| `id`            | `uuid`      | Primary key        |
| `email`         | `text`      | Unique             |
| `password_hash` | `text`      | Hashed password    |
| `created_at`    | `timestamp` | Auto-set on insert |
| `updated_at`    | `timestamp` | Auto-updated       |

## Production

```bash
pnpm build
NODE_ENV=production pnpm start
```

Set `DATABASE_URL` and `REDIS_URL` to your production services before starting.
