# Section 1: Environment Setup

## Configure postgres with wal_level=logical
- type: task
- parent: electric-tanstack-db-voi
- priority: P1
- description: Configure existing postgres with `wal_level=logical` if not already set (mooncakelabs/pg_mooncake supports this)

## Create .env file with DATABASE_URL
- type: task
- parent: electric-tanstack-db-voi
- priority: P1
- description: Create `.env` file with DATABASE_URL pointing to existing postgres (`postgresql://user:password@127.0.0.1:5432/postgres`)

## Create .env.example template
- type: task
- parent: electric-tanstack-db-voi
- priority: P2
- description: Create `.env.example` as template for other developers

# Section 2: Project Scaffolding

## Initialize package.json with bun scripts
- type: task
- parent: electric-tanstack-db-voi
- priority: P1
- description: Initialize `package.json` with bun-compatible scripts and dependencies for Electric, TanStack DB, TanStack Start, Drizzle

## Create TypeScript configuration
- type: task
- parent: electric-tanstack-db-voi
- priority: P1
- description: Create `tsconfig.json` and related TypeScript configuration files

## Create Vite config with TanStack Start
- type: task
- parent: electric-tanstack-db-voi
- priority: P1
- description: Create `vite.config.ts` with TanStack Start configuration

## Create Drizzle config
- type: task
- parent: electric-tanstack-db-voi
- priority: P1
- description: Create `drizzle.config.ts` pointing to shared postgres, migrations in `docker/migrations/`

# Section 3: Docker Configuration

## Create docker-compose.yml with Electric service
- type: task
- parent: electric-tanstack-db-voi
- priority: P1
- description: Create `docker/docker-compose.yml` with Electric service (port 30000)

## Configure Electric to connect to host postgres
- type: task
- parent: electric-tanstack-db-voi
- priority: P1
- description: Configure Electric to connect to host postgres via `host.docker.internal`

## Add healthcheck and restart policies
- type: task
- parent: electric-tanstack-db-voi
- priority: P2
- description: Add healthcheck and restart policies to docker-compose

# Section 4: Database Schema & Migrations

## Create database schema with Drizzle
- type: task
- parent: electric-tanstack-db-voi
- priority: P1
- description: Create `src/db/schema.ts` with projects and todos tables (referencing existing Zero `user` table)

## Generate initial migration
- type: task
- parent: electric-tanstack-db-voi
- priority: P1
- description: Generate initial migration with `bun run db:generate`

## Apply migration to postgres
- type: task
- parent: electric-tanstack-db-voi
- priority: P1
- description: Apply migration to existing postgres with `bun run db:migrate`

# Section 5: Application Code

## Create TanStack DB collections
- type: task
- parent: electric-tanstack-db-voi
- priority: P1
- description: Create `src/lib/collections.ts` with TanStack DB collection definitions

## Create Electric client configuration
- type: task
- parent: electric-tanstack-db-voi
- priority: P1
- description: Create `src/lib/electric.ts` for Electric client configuration

## Create TanStack Start routes structure
- type: task
- parent: electric-tanstack-db-voi
- priority: P1
- description: Create `src/routes/` directory structure with TanStack Start routes

## Create API proxy routes for Electric shapes
- type: task
- parent: electric-tanstack-db-voi
- priority: P1
- description: Create `src/routes/api/` proxy routes for Electric shapes

## Create UI components for CRUD
- type: task
- parent: electric-tanstack-db-voi
- priority: P2
- description: Create basic UI components for projects/todos CRUD operations

# Section 6: HTTPS/Caddy Setup

## Create Caddyfile for HTTPS proxy
- type: task
- parent: electric-tanstack-db-voi
- priority: P2
- description: Create `Caddyfile` for HTTPS proxy to development server

## Document Caddy installation in README
- type: task
- parent: electric-tanstack-db-voi
- priority: P2
- description: Document Caddy installation and trust steps in README

# Section 7: Development Scripts

## Add bun run dev script
- type: task
- parent: electric-tanstack-db-voi
- priority: P1
- description: Add `bun run dev` - start Vite dev server

## Add bun run dev:electric script
- type: task
- parent: electric-tanstack-db-voi
- priority: P1
- description: Add `bun run dev:electric` - start Electric service via docker

## Add bun run dev:caddy script
- type: task
- parent: electric-tanstack-db-voi
- priority: P2
- description: Add `bun run dev:caddy` - start Caddy HTTPS proxy

## Add bun run dev:all script
- type: task
- parent: electric-tanstack-db-voi
- priority: P1
- description: Add `bun run dev:all` - start all services concurrently

## Add database migration scripts
- type: task
- parent: electric-tanstack-db-voi
- priority: P1
- description: Add `bun run db:generate` and `bun run db:migrate` scripts

# Section 8: Documentation

## Create README with setup instructions
- type: task
- parent: electric-tanstack-db-voi
- priority: P2
- description: Create `README.md` with setup instructions

## Document postgres prerequisite
- type: task
- parent: electric-tanstack-db-voi
- priority: P2
- description: Document prerequisite: existing postgres from `zero-hono-react-counter-uplot` must be running

## Document Caddy installation
- type: task
- parent: electric-tanstack-db-voi
- priority: P2
- description: Document Caddy installation (`brew install caddy && caddy trust`)

# Section 9: Validation

## Test Electric connection to postgres
- type: task
- parent: electric-tanstack-db-voi
- priority: P1
- description: Test Electric connection to existing postgres

## Test shape sync for tables
- type: task
- parent: electric-tanstack-db-voi
- priority: P1
- description: Test shape sync for projects/todos tables

## Verify Zero tables remain functional
- type: task
- parent: electric-tanstack-db-voi
- priority: P1
- description: Verify existing Zero tables remain functional

## Test HTTPS via Caddy
- type: task
- parent: electric-tanstack-db-voi
- priority: P2
- description: Test HTTPS/HTTP2 via Caddy
