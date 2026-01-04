# Design: Global Search Feature

## Context

The 'searches' table contains ~1000+ records with code/name fields across two categories (asset, superinvestor). Users need instant, offline-capable search without network round-trips. Leveraging Electric SQL's pglite support ensures:
- Local SQLite replica syncs automatically
- Queries execute in-process without HTTP calls
- Offline support with background sync when reconnected
- Reactive updates as data changes

## Goals

- **Speed**: Sub-10ms search response time using local pglite queries
- **Simplicity**: Minimal dependencies, single search shape
- **Offline**: Full search works without network connectivity
- **Separation**: Completely independent from projects/todos features
- **UX**: Global sticky search bar accessible from any page

Non-Goals:
- Full-text search stemming or fuzzy matching (exact substring match is sufficient)
- Advanced filters beyond category/type
- Search history or saved searches
- Ranking/relevance scoring

## Decisions

### 1. Electric Shape for 'searches' Table
- **Decision**: Single unbatched shape syncing entire 'searches' table
- **Why**: Table is small (~1000 records), fits in pglite easily, eliminates shape filtering complexity
- **Alternative considered**: Filtered shapes per category—rejected (adds complexity, minimal memory savings)

### 2. Minimum 2-Character Requirement (No Debouncing)
- **Decision**: Require at least 2 characters before showing search results; no debouncing
- **Why**: pglite queries are instant (<10ms), so debouncing is unnecessary. 2-char minimum prevents noisy UX with single-character results
- **Alternative considered**: Debouncing—rejected (adds complexity for zero performance benefit with pglite)

### 3. React Router for Routing
- **Decision**: Add React Router for dynamic routes `/category/:code` and `/category/:code/:cusip`
- **Why**: Standard pattern, enables deep linking, supports browser history
- **Alternative considered**: Single page with state—rejected (limits shareable URLs, poor UX)

### 4. Sticky Header Component
- **Decision**: Position Global Search in fixed top bar using shadcn/ui Button/Input
- **Why**: Accessible from every page, follows standard UX pattern
- **Alternative considered**: Floating button—rejected (less discoverable, less standard)

### 5. Dropdown Results (Not Modal)
- **Decision**: Show search results in dropdown below input, auto-close on selection
- **Why**: Lower friction, instant feedback, doesn't interrupt navigation
- **Alternative considered**: Modal dialog—rejected (extra click to close, breaks flow)

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Large shape sync blocking initial load | Lazy-load shape on first search interaction |
| Single-character queries show too many results | Require minimum 2 characters before showing results |
| Memory pressure from large table | Table is small (~1000 rows), no concern; monitor if grows |
| Route params with special characters | URL-encode code/cusip in link generation |

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│ React App (src/App.tsx with Router)                     │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │ GlobalSearch (sticky header)                     │   │
│  │ - Input field with debounced onChange            │   │
│  │ - Dropdown showing filtered results              │   │
│  │ - Link to /category/{code}/{cusip} (if asset)    │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Router Outlet (dynamic routes)                   │   │
│  │ - /category/:code                    (base)      │   │
│  │ - /category/:code/:cusip             (asset)     │   │
│  │ - /projects, /todos (existing)                   │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────┐
│ Electric Client (src/lib/electric.ts)                   │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Shape: searches                                  │   │
│  │ - Syncs entire 'searches' table                  │   │
│  │ - Uses pglite for local queries                  │   │
│  │ - Auto-subscribes on first search               │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────┐
│ Electric Server (port 30000)                            │
│                                                         │
│ Syncs data from PostgreSQL to client pglite            │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

1. **User types in search input** → input is <2 chars? show placeholder; ≥2 chars? execute instantly
2. **useSearch hook queries pglite locally** → <10ms response
3. **Results displayed in dropdown** → instant feedback
4. **User clicks result** → navigate to `/category/{code}` or `/category/{code}/{cusip}`
5. **DetailPage mounts** → empty state (no data passed from route)

## Implementation Sequence

1. Install dependencies (react-router, shadcn/ui components)
2. Add 'searches' shape to electric.ts
3. Create useSearch hook with debouncing
4. Create GlobalSearch component
5. Create DetailPage component
6. Wrap App with React Router
7. Add route handlers
8. Test end-to-end search and navigation

## Rollback Plan

- Remove Router wrapping in App.tsx
- Delete GlobalSearch component
- Delete DetailPage and route handlers
- Revert electric.ts searches shape
- Note: No database migrations needed, only client-side code
