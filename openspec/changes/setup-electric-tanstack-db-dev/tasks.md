## 1. Environment Setup

- [ ] 1.1 Configure existing postgres with `wal_level=logical` if not already set (mooncakelabs/pg_mooncake supports this)
- [ ] 1.2 Create `.env` file with DATABASE_URL pointing to existing postgres (`postgresql://user:password@127.0.0.1:5432/postgres`)
- [ ] 1.3 Create `.env.example` as template

## 2. Project Scaffolding

- [ ] 2.1 Initialize `package.json` with bun-compatible scripts and dependencies
- [ ] 2.2 Create `tsconfig.json` and related TypeScript configuration
- [ ] 2.3 Create `vite.config.ts` with TanStack Start configuration
- [ ] 2.4 Create `drizzle.config.ts` pointing to shared postgres, migrations in `docker/migrations/`

## 3. Docker Configuration

- [ ] 3.1 Create `docker/docker-compose.yml` with Electric service (port 30000)
- [ ] 3.2 Configure Electric to connect to host postgres via `host.docker.internal`
- [ ] 3.3 Add healthcheck and restart policies

## 4. Database Schema & Migrations

- [ ] 4.1 Create `src/db/schema.ts` with projects and todos tables (referencing existing Zero `user` table)
- [ ] 4.2 Generate initial migration with `bun run db:generate`
- [ ] 4.3 Apply migration to existing postgres with `bun run db:migrate`

## 5. Application Code

- [ ] 5.1 Create `src/lib/collections.ts` with TanStack DB collection definitions
- [ ] 5.2 Create `src/lib/electric.ts` for Electric client configuration
- [ ] 5.3 Create `src/routes/` directory structure with TanStack Start routes
- [ ] 5.4 Create `src/routes/api/` proxy routes for Electric shapes
- [ ] 5.5 Create basic UI components for projects/todos CRUD

## 6. HTTPS/Caddy Setup

- [ ] 6.1 Create `Caddyfile` for HTTPS proxy to development server
- [ ] 6.2 Document Caddy installation and trust steps in README

## 7. Development Scripts (Bun)

- [ ] 7.1 Add `bun run dev` - start Vite dev server
- [ ] 7.2 Add `bun run dev:electric` - start Electric service via docker
- [ ] 7.3 Add `bun run dev:caddy` - start Caddy HTTPS proxy
- [ ] 7.4 Add `bun run dev:all` - start all services concurrently
- [ ] 7.5 Add `bun run db:generate` and `bun run db:migrate` scripts

## 8. Documentation

- [ ] 8.1 Create `README.md` with setup instructions
- [ ] 8.2 Document prerequisite: existing postgres from `zero-hono-react-counter-uplot` must be running
- [ ] 8.3 Document Caddy installation (`brew install caddy && caddy trust`)

## 9. Validation

- [ ] 9.1 Test Electric connection to existing postgres
- [ ] 9.2 Test shape sync for projects/todos tables
- [ ] 9.3 Verify existing Zero tables remain functional
- [ ] 9.4 Test HTTPS/HTTP2 via Caddy
