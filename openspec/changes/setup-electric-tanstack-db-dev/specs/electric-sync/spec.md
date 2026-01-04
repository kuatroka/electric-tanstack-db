## ADDED Requirements

### Requirement: Electric SQL Local Development Environment
The system SHALL provide a local development environment for Electric SQL with TanStack DB that reuses an existing PostgreSQL database.

#### Scenario: Start development environment
- **WHEN** the user runs `bun run dev:all`
- **THEN** the Electric sync service starts on port 30000
- **AND** the TanStack Start development server starts
- **AND** Caddy HTTPS proxy starts on port 5173
- **AND** the application is accessible at `https://localhost:5173`

#### Scenario: Connect to existing PostgreSQL
- **WHEN** Electric service starts
- **THEN** it connects to the existing PostgreSQL at `127.0.0.1:5432`
- **AND** it streams changes from the `projects` and `todos` tables
- **AND** existing tables (counters, entities, etc.) remain unaffected

### Requirement: Database Schema for Electric Sync
The system SHALL define Drizzle ORM schema for Electric-synced tables that coexist with existing Zero-synced tables.

#### Scenario: Projects table creation
- **WHEN** the database migration runs
- **THEN** a `projects` table is created with columns: id, name, description, owner_id, shared_user_ids, created_at
- **AND** owner_id references the existing Zero `user` table via foreign key
- **AND** the table includes appropriate indexes for efficient querying

#### Scenario: Todos table creation
- **WHEN** the database migration runs
- **THEN** a `todos` table is created with columns: id, text, completed, user_id, project_id, user_ids, created_at
- **AND** user_id references the existing Zero `user` table via foreign key
- **AND** project_id references the projects table via foreign key

### Requirement: TanStack DB Collections
The system SHALL define TanStack DB collections for reactive data synchronization.

#### Scenario: Projects collection sync
- **WHEN** the application loads
- **THEN** the projects collection establishes a shape subscription with Electric
- **AND** local changes are optimistically applied
- **AND** server mutations are sent via API routes

#### Scenario: Todos collection sync
- **WHEN** a user views a project
- **THEN** the todos collection syncs todos filtered by project_id
- **AND** changes are reflected in real-time across all connected clients

### Requirement: Bun-Based Development Workflow
The system SHALL use bun as the JavaScript runtime and package manager.

#### Scenario: Package installation
- **WHEN** the user runs `bun install`
- **THEN** all dependencies are installed from `package.json`
- **AND** no node_modules lockfile conflicts occur

#### Scenario: Development scripts
- **WHEN** the user runs any development script (`bun run dev`, `bun run db:migrate`, etc.)
- **THEN** the script executes using bun runtime
- **AND** performance is equivalent to or better than node/pnpm

### Requirement: HTTPS Development with Caddy
The system SHALL provide HTTPS support for local development via Caddy reverse proxy.

#### Scenario: Caddy proxy setup
- **WHEN** Caddy is running with the provided Caddyfile
- **THEN** HTTPS requests to `localhost:5173` are proxied to the development server
- **AND** HTTP/2 multiplexing is enabled for optimal Electric sync performance

#### Scenario: Certificate trust
- **WHEN** the user runs `caddy trust` after installation
- **THEN** the local CA certificate is added to the system trust store
- **AND** browser warnings for localhost HTTPS are eliminated
