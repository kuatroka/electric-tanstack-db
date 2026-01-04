# Electric + TanStack DB

Local-first sync with Electric SQL and TanStack DB, sharing PostgreSQL with the zero-hono-react-counter-uplot project.

## Prerequisites

1. **PostgreSQL running** from `zero-hono-react-counter-uplot`:
   ```bash
   cd ../zero-hono-react-counter-uplot
   docker compose up -d
   ```

2. **Caddy** for HTTPS/HTTP2 proxy:
   ```bash
   brew install caddy
   caddy trust  # Add local CA to system trust store
   ```

3. **Bun** runtime:
   ```bash
   # Already installed if you have the zero project
   curl -fsSL https://bun.sh/install | bash
   ```

## Setup

```bash
# Install dependencies
bun install

# Generate and apply migrations
bun run db:generate
bun run db:migrate
```

## Development

Start all services:
```bash
bun run dev:all
```

Or start individually:
```bash
# Terminal 1: Electric sync service (port 30000)
bun run dev:electric

# Terminal 2: App server (port 5174)
bun run dev

# Terminal 3: HTTPS proxy (port 5173)
bun run dev:caddy
```

Access the app at: **https://localhost:5173**

## Architecture

```
Browser (HTTPS:5173)
    ↓ Caddy (HTTP/2)
    ↓
TanStack Start App (HTTP:5174)
    ↓ Shape requests
    ↓
Electric Sync (HTTP:30000)
    ↓ WAL streaming
    ↓
PostgreSQL (port 5432) ← shared with Zero project
```

## Database

Uses the same PostgreSQL instance as zero-hono-react-counter-uplot:
- Connection: `postgresql://user:password@127.0.0.1:5432/postgres`
- Electric-synced tables: `projects`, `todos`
- References existing `user` table from Zero

## Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start Vite dev server |
| `bun run dev:electric` | Start Electric service |
| `bun run dev:caddy` | Start Caddy HTTPS proxy |
| `bun run dev:all` | Start all services |
| `bun run db:generate` | Generate Drizzle migrations |
| `bun run db:migrate` | Apply migrations |
| `bun run db:studio` | Open Drizzle Studio |
