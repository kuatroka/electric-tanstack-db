# Proposal: Recreate Fintellectus App

## Summary

Complete rebuild of the **fintellectus** financial analytics application using Electric SQL + TanStack DB architecture. The app provides real-time tracking of superinvestor (13F filers) activity and asset analysis with interactive charts, searchable tables, and local-first data synchronization.

## Motivation

The current project has a basic Electric SQL + TanStack DB setup with a simple todo/counter demo. We need to transform this into a full-featured financial analytics platform matching the reference implementation while leveraging Electric's real-time sync capabilities.

## Reference

- Source: `docker/data/repomix-output-kuatroka-zero-hono-react-counter-uplot.xml`
- Original repo: https://github.com/kuatroka/zero-hono-react-counter-uplot

## Goals

1. **Full Feature Parity**: Recreate all routes, charts, tables, and UI components from the reference
2. **Electric SQL Backend**: Replace DuckDB-only backend with Electric SQL for real-time sync
3. **TanStack DB Collections**: Use TanStack DB for local-first data with Electric sync
4. **Performance**: Maintain sub-millisecond search and instant UI interactions
5. **Chart Interactivity**: Implement drill-down charts with click handlers and tooltips

## Non-Goals

- Authentication/authorization (keep minimal placeholder)
- Data ingestion pipeline (assume data is pre-loaded)
- Blue-green database deployment (simplify to single DB)

## Scope

### Routes & Pages (5 pages)
| Route | Description |
|-------|-------------|
| `/` | Home/landing page |
| `/assets` | Assets table + All Assets Activity chart |
| `/assets/:code/:cusip` | Asset detail with multiple charts and drilldown |
| `/superinvestors` | Superinvestors table |
| `/superinvestors/:cik` | Superinvestor detail with portfolio value chart |

### Charts (5 chart types)
| Chart | Library | Location |
|-------|---------|----------|
| All Assets Activity | ECharts | `/assets` |
| Investor Activity | uPlot | `/assets/:code/:cusip` |
| Investor Flow | Recharts | `/assets/:code/:cusip` |
| Portfolio Value | uPlot | `/superinvestors/:cik` |
| Opened/Closed Bar | ECharts | Reusable component |

### Tables (3 table types)
| Table | Features |
|-------|----------|
| Assets Table | Search, sort, pagination, keyboard nav |
| Superinvestors Table | Search, sort, pagination, keyboard nav |
| Drilldown Table | Investor activity per quarter |

### API Endpoints (10 endpoints)
| Endpoint | Purpose |
|----------|---------|
| `GET /api/assets` | All assets |
| `GET /api/superinvestors` | All superinvestors |
| `GET /api/superinvestors/:cik` | Single superinvestor |
| `GET /api/all-assets-activity` | Aggregated activity by quarter |
| `GET /api/investor-flow` | Inflow/outflow per quarter |
| `GET /api/cik-quarterly/:cik` | Portfolio value over time |
| `GET /api/drilldown/:ticker` | Investor drilldown data |
| `GET /api/duckdb-investor-drilldown` | Detailed drilldown |
| `GET /api/duckdb-search` | Global search |
| `GET /api/data-freshness` | Data freshness check |

### UI Components
- GlobalNav with logo, search, navigation links
- SiteLayout with responsive layout
- DataTable generic component
- GlobalSearch with instant results
- LatencyBadge showing query timing
- Shadcn/ui components (Button, Card, Input, Select, Badge, Dialog, Table)

## Architecture Decisions

See [design.md](./design.md) for detailed architecture.

### Key Changes from Reference

1. **Electric SQL instead of DuckDB**: Use Electric for real-time sync from PostgreSQL
2. **TanStack DB Collections**: Replace custom IndexedDB caching with TanStack DB
3. **Simplified Backend**: Single Hono server with Electric-aware endpoints
4. **Preserved Charts**: Keep uPlot, ECharts, Recharts for maximum flexibility

## Success Criteria

1. All 5 routes render correctly with data
2. All charts display correct data with interactivity
3. Tables support search, sort, and pagination
4. Global search returns instant results
5. Data syncs from Electric in real-time
6. No console errors in production build

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Electric shape queries differ from DuckDB | High | Design Electric-compatible schema upfront |
| Chart library conflicts | Medium | Use separate bundles per chart type |
| Large dataset performance | Medium | Implement pagination and virtual scrolling |
| Missing 13F data | Low | Use sample/mock data for demo |

## Timeline Phases

### Phase 1: Foundation (Infrastructure)
- Database schema with Electric sync
- API endpoints structure
- TanStack DB collections

### Phase 2: Core UI (Tables & Navigation)
- DataTable component
- Assets and Superinvestors tables
- GlobalNav and SiteLayout
- Global search

### Phase 3: Charts
- uPlot integration
- ECharts integration
- Recharts integration
- Chart interactivity

### Phase 4: Detail Pages
- Asset detail page with charts
- Superinvestor detail page
- Drilldown functionality

### Phase 5: Polish
- Error handling
- Loading states
- Performance optimization
- Testing

## Related Changes

- Supersedes: `setup-electric-tanstack-db-dev` (base setup)
- Supersedes: `add-global-search` (will be reimplemented)
