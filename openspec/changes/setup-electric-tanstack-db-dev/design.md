## Context

This project sets up Electric SQL with TanStack DB in a shared database environment. The existing `zero-hono-react-counter-uplot` project runs PostgreSQL via Docker with the Zero sync system. We want to add Electric as a parallel sync option, demonstrating both approaches.

### Stakeholders
- Developer (yo_macbook) - primary user
- Existing Zero-based application - must remain functional

### Constraints
- Must reuse existing PostgreSQL instance (no separate database)
- Must use bun instead of node/pnpm
- Electric requires HTTP/2 for optimal performance (Caddy needed)
- Cannot conflict with existing Zero tables/schema

## Goals / Non-Goals

### Goals
- Working Electric TanStack DB development environment
- Shared PostgreSQL with existing Zero project
- Bun-based development workflow
- HTTPS/HTTP2 via Caddy for optimal Electric performance

### Non-Goals
- Production deployment configuration
- Authentication integration (Better Auth) - can be added later
- Full feature parity with original starter - minimal viable setup
- Replacing Zero with Electric - they coexist

## Decisions

### Decision 1: Reuse existing docker-compose
**What**: Extend the existing `zero-hono-react-counter-uplot/docker/docker-compose.yml` rather than creating a new one
**Why**: Avoids port conflicts, reduces complexity, single source of truth for PostgreSQL
**Alternatives considered**:
- Separate docker-compose: Would require different ports, more complex networking
- Electric Cloud: Not needed for local dev, adds external dependency

### Decision 2: Connect to external postgres, run Electric locally
**What**: Electric service defined in this project's docker-compose connects to existing postgres on host network
**Why**: The existing postgres is already running; we just need to add Electric service
**Alternative**: Run Electric in the existing project's docker-compose - rejected as it couples the projects

### Decision 3: Separate migrations directory
**What**: New migrations in this project's `docker/migrations/` for Electric-specific tables
**Why**: Clear separation of concerns, Electric tables are independent of Zero tables
**Alternative**: Add migrations to existing project - rejected as it mixes concerns

### Decision 4: Use bun throughout
**What**: Replace all pnpm/npm commands with bun equivalents
**Why**: User requirement; bun is faster and compatible with the existing project's setup
**Alternative**: Keep pnpm - rejected per user requirements

## Architecture

```
zero-hono-react-counter-uplot/
├── docker/
│   └── docker-compose.yml  # Postgres (port 5432)
└── ...existing project...

electric-tanstack-db/  (THIS PROJECT)
├── docker/
│   ├── docker-compose.yml  # Electric service only (port 30000)
│   └── migrations/         # Electric-specific tables
├── src/
│   ├── db/schema.ts        # Drizzle schema for Electric tables
│   ├── lib/collections.ts  # TanStack DB collections
│   ├── routes/             # TanStack Start routes
│   └── ...
├── Caddyfile               # HTTPS proxy (port 5173 -> app)
├── package.json            # Bun scripts
├── drizzle.config.ts       # Points to shared postgres
└── .env                    # DATABASE_URL to shared postgres
```

### Data Flow
```
Browser (HTTPS:5173)
    ↓ Caddy (HTTP2)
    ↓
TanStack Start App (HTTP:5174)
    ↓ Shape requests
    ↓
Electric Sync (HTTP:30000)
    ↓ WAL streaming
    ↓
PostgreSQL (port 5432) ← shared with Zero project
```

## Risks / Trade-offs

### Risk: Port conflicts
**Mitigation**: Use non-conflicting ports (Electric: 30000, App: 5174, Caddy: 5173). Document in README.

### Risk: Schema conflicts with Zero
**Mitigation**: Use distinct table names (projects, todos) that don't overlap with existing Zero tables.

### Risk: WAL configuration
**Mitigation**: Verify existing postgres has `wal_level=logical`. The mooncakelabs/pg_mooncake image should support this.

### Trade-off: Two docker-compose files
**Accepted**: Slightly more complex to start (two services), but cleaner separation of concerns.

## Resolved Questions

1. **WAL level support**: Confirmed - `mooncakelabs/pg_mooncake` is a standard postgres extension and supports `wal_level=logical`.
2. **Auth integration**: Confirmed - Electric tables (projects, todos) will reference the existing Zero `user` table via foreign keys.
