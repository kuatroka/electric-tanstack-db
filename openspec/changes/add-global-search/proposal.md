# Change: Add Global Search Feature

## Why

Enable instant, full-text search across the 'searches' table (assets and superinvestors) without network latency. Users need a sticky global search interface to quickly navigate to detail pages. Leveraging Electric SQL's pglite support allows us to execute searches locally with offline capability while maintaining sync with the server.

## What Changes

1. **Sync 'searches' table via Electric** - Configure Electric to sync the 'searches' table to the client
2. **Global search UI component** - Add a sticky top navigation bar with a search input using shadcn/ui components
3. **Search shape and hooks** - Create Electric shape streams and React hooks for fast, reactive searches
4. **Detail page routes** - Add dynamic routes for `/category/:code` and `/category/:code/:cusip`
5. **Detail page components** - Build detail views that display search result information
6. **Search result highlighting** - Display matching results in a dropdown with instant filtering

## Impact

- **Affected specs**: search-feature (new capability)
- **Affected code**:
  - New: `src/components/GlobalSearch.tsx`, `src/hooks/useSearch.ts`, `src/pages/DetailPage.tsx`
  - Modified: `src/App.tsx` (add routing), `src/lib/electric.ts` (add searches shape)
  - No database changes (searches table already exists in postgres)
- **Dependencies**:
  - Electric SQL client (already installed)
  - shadcn/ui components (needs installation via Button, Input, Dialog/Dropdown)
  - React Router (needs installation for routing)

## Notes

- Search is completely independent from projects/todos features
- Uses pglite for offline-capable instant search
- No backend API needed for search queries—all execute locally
- Detail pages show empty state until user navigates from search results
