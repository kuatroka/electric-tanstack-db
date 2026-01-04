# Change: Setup Electric TanStack DB Development Environment

## Why

Enable local development with Electric SQL and TanStack DB by reusing the existing PostgreSQL database from the `zero-hono-react-counter-uplot` project. This avoids duplicating database infrastructure and allows the Electric sync system to work alongside the existing Zero sync system, demonstrating both approaches with the same data.

## What Changes

1. **Scaffold Electric TanStack DB project** - Clone/bootstrap the tanstack-db-web-starter structure into this repo
2. **Integrate with existing PostgreSQL** - Configure Electric to connect to the existing postgres instance at `127.0.0.1:5432`
3. **Add Electric service to docker-compose** - Extend the existing docker-compose with an Electric sync service
4. **Create database migrations** - Add tables required by Electric TanStack starter (projects, todos) to the existing database
5. **Convert to Bun** - Replace pnpm/npm scripts with bun equivalents throughout
6. **Configure Caddy for HTTPS** - Add Caddyfile for HTTP/2 development (Electric benefits from HTTP/2 multiplexing)

## Impact

- **Affected specs**: electric-sync (new capability)
- **Affected code**:
  - New: `src/`, `docker/`, `.env`, `package.json`, `Caddyfile`, `drizzle.config.ts`
  - Modified: Existing postgres database will receive new tables via migrations
- **Dependencies**:
  - Reuses existing PostgreSQL from `zero-hono-react-counter-uplot` project
  - Requires Caddy to be installed locally (`brew install caddy && caddy trust`)
  - Requires bun as runtime

## Migration Notes

- The existing database at `/Users/yo_macbook/Documents/dev/zero-hono-react-counter-uplot` remains the source of truth for PostgreSQL
- Electric connects to the same postgres instance as Zero but syncs different tables
- No data migration needed - new tables will be created alongside existing ones
