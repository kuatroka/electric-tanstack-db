# Design: Recreate Fintellectus App

## Overview

This document describes the architectural design for rebuilding the fintellectus financial analytics application using Electric SQL + TanStack DB.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Frontend (React)                          │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────────┐ │
│  │ TanStack    │  │ TanStack DB  │  │ Chart Components            │ │
│  │ Router      │  │ Collections  │  │ (uPlot, ECharts, Recharts)  │ │
│  └─────────────┘  └──────────────┘  └─────────────────────────────┘ │
│         │                │                       │                   │
│         ▼                ▼                       ▼                   │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │                    UI Components (Shadcn/ui)                    ││
│  │  DataTable | GlobalNav | GlobalSearch | Cards | Badges          ││
│  └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP / Electric Sync
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        Backend (Hono)                               │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────────┐  │
│  │ REST API Routes  │  │ Electric Shapes  │  │ Query Handlers    │  │
│  │ /api/*           │  │ Sync Config      │  │ (Drizzle ORM)     │  │
│  └──────────────────┘  └──────────────────┘  └───────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      PostgreSQL + Electric                          │
├─────────────────────────────────────────────────────────────────────┤
│  Tables: assets, superinvestors, searches, activity_summary,       │
│          cik_quarterly, investor_flow, drilldown_activity          │
│                                                                     │
│  Electric: Real-time sync shapes for each table                    │
└─────────────────────────────────────────────────────────────────────┘
```

## Database Schema Design

### Core Tables

```sql
-- Asset master data
CREATE TABLE assets (
  id BIGSERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,        -- Ticker symbol
  cusip TEXT NOT NULL UNIQUE,       -- CUSIP identifier
  name TEXT NOT NULL,               -- Full asset name
  sector TEXT,                      -- Sector classification
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Superinvestor master data
CREATE TABLE superinvestors (
  id BIGSERIAL PRIMARY KEY,
  cik TEXT NOT NULL UNIQUE,         -- SEC CIK number
  name TEXT NOT NULL,               -- Investor name
  ticker TEXT,                      -- Associated ticker if any
  active_periods TEXT,              -- Comma-separated active quarters
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Global search index
CREATE TABLE searches (
  id BIGSERIAL PRIMARY KEY,
  code TEXT NOT NULL,               -- Identifier (ticker or CIK)
  name TEXT NOT NULL,               -- Display name
  category TEXT NOT NULL CHECK (category IN ('assets', 'superinvestors')),
  UNIQUE(code, category)
);

-- Aggregated activity by quarter (for charts)
CREATE TABLE activity_summary (
  id BIGSERIAL PRIMARY KEY,
  cusip TEXT,                       -- NULL for all-assets aggregate
  ticker TEXT,
  quarter TEXT NOT NULL,            -- Format: "2024-Q1"
  opened INTEGER DEFAULT 0,
  closed INTEGER DEFAULT 0,
  added INTEGER DEFAULT 0,
  reduced INTEGER DEFAULT 0,
  held INTEGER DEFAULT 0,
  UNIQUE(cusip, quarter)
);

-- Portfolio value over time per CIK
CREATE TABLE cik_quarterly (
  id BIGSERIAL PRIMARY KEY,
  cik TEXT NOT NULL,
  quarter TEXT NOT NULL,
  quarter_end_date DATE,
  total_value NUMERIC(20, 2),       -- Portfolio value in USD
  total_value_prc_chg NUMERIC(10, 4), -- Percentage change
  num_assets INTEGER,
  UNIQUE(cik, quarter)
);

-- Investor flow per asset
CREATE TABLE investor_flow (
  id BIGSERIAL PRIMARY KEY,
  ticker TEXT NOT NULL,
  quarter TEXT NOT NULL,
  inflow NUMERIC(20, 2),
  outflow NUMERIC(20, 2),
  UNIQUE(ticker, quarter)
);

-- Drilldown activity details
CREATE TABLE drilldown_activity (
  id BIGSERIAL PRIMARY KEY,
  cusip TEXT NOT NULL,
  ticker TEXT NOT NULL,
  quarter TEXT NOT NULL,
  cik TEXT NOT NULL,
  cik_name TEXT,
  action TEXT CHECK (action IN ('open', 'add', 'reduce', 'close', 'hold')),
  shares BIGINT,
  value NUMERIC(20, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_activity_summary_quarter ON activity_summary(quarter);
CREATE INDEX idx_activity_summary_cusip ON activity_summary(cusip);
CREATE INDEX idx_cik_quarterly_cik ON cik_quarterly(cik);
CREATE INDEX idx_investor_flow_ticker ON investor_flow(ticker);
CREATE INDEX idx_drilldown_activity_cusip_quarter ON drilldown_activity(cusip, quarter);
CREATE INDEX idx_searches_category ON searches(category);
CREATE INDEX idx_searches_name ON searches(name);
```

### Electric Sync Shapes

```typescript
// Each table synced as a separate Electric shape
const shapes = {
  assets: { table: 'assets' },
  superinvestors: { table: 'superinvestors' },
  searches: { table: 'searches' },
  activitySummary: {
    table: 'activity_summary',
    // Filter for specific asset on detail pages
    where: `cusip = $cusip OR cusip IS NULL`
  },
  cikQuarterly: {
    table: 'cik_quarterly',
    where: `cik = $cik`
  },
  investorFlow: {
    table: 'investor_flow',
    where: `ticker = $ticker`
  },
  drilldownActivity: {
    table: 'drilldown_activity',
    where: `cusip = $cusip AND quarter = $quarter`
  }
};
```

## TanStack DB Collections Design

```typescript
// src/lib/collections.ts

// Assets collection - preloaded on app init
export const assetsCollection = createCollection<Asset>({
  id: 'assets',
  shape: () => electricClient.sync({ table: 'assets' }),
  primaryKey: 'id',
  indexes: ['code', 'cusip', 'name']
});

// Superinvestors collection - preloaded on app init
export const superinvestorsCollection = createCollection<Superinvestor>({
  id: 'superinvestors',
  shape: () => electricClient.sync({ table: 'superinvestors' }),
  primaryKey: 'id',
  indexes: ['cik', 'name']
});

// Searches collection - for global search
export const searchesCollection = createCollection<SearchEntry>({
  id: 'searches',
  shape: () => electricClient.sync({ table: 'searches' }),
  primaryKey: 'id',
  indexes: ['code', 'name', 'category']
});

// Activity summary - for charts
export const activitySummaryCollection = createCollection<ActivitySummary>({
  id: 'activity_summary',
  shape: () => electricClient.sync({ table: 'activity_summary' }),
  primaryKey: 'id',
  indexes: ['cusip', 'quarter']
});
```

## Component Architecture

### Page Components

```
src/
├── pages/
│   ├── HomePage.tsx              # Landing page
│   ├── AssetsPage.tsx            # Assets table + chart
│   ├── AssetDetailPage.tsx       # Asset detail with charts
│   ├── SuperinvestorsPage.tsx    # Superinvestors table
│   └── SuperinvestorDetailPage.tsx # Investor detail with chart
```

### Chart Components

```
src/components/charts/
├── AllAssetsActivityChart.tsx    # ECharts bar chart
├── InvestorActivityChart.tsx     # uPlot bar chart with interactions
├── InvestorFlowChart.tsx         # Recharts line chart
├── PortfolioValueChart.tsx       # uPlot line chart
├── OpenedClosedBarChart.tsx      # Reusable ECharts component
└── chartFactory.ts               # uPlot chart factory
```

### UI Components

```
src/components/
├── ui/                           # Shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── badge.tsx
│   ├── dialog.tsx
│   ├── command.tsx
│   └── table.tsx
├── DataTable.tsx                 # Generic table with search/sort/pagination
├── GlobalNav.tsx                 # Navigation header
├── GlobalSearch.tsx              # Instant search component
├── SiteLayout.tsx                # Page layout wrapper
├── LatencyBadge.tsx              # Query timing display
└── DrilldownTable.tsx            # Investor activity drilldown
```

## Data Flow Patterns

### Pattern 1: Preloaded Collection Data

```typescript
// For tables that need all data upfront (Assets, Superinvestors)
function AssetsPage() {
  const assets = useLiveQuery(() =>
    assetsCollection.query().toArray()
  );

  return <DataTable data={assets} />;
}
```

### Pattern 2: Parameterized Queries

```typescript
// For detail pages with specific filters
function AssetDetailPage({ cusip }: { cusip: string }) {
  const activity = useLiveQuery(() =>
    activitySummaryCollection
      .query()
      .where('cusip', '=', cusip)
      .toArray()
  );

  return <InvestorActivityChart data={activity} />;
}
```

### Pattern 3: API Fallback for Complex Queries

```typescript
// For aggregations that need server-side processing
function useInvestorDrilldown(ticker: string, quarter: string) {
  return useQuery({
    queryKey: ['drilldown', ticker, quarter],
    queryFn: () => fetch(`/api/drilldown/${ticker}?quarter=${quarter}`)
      .then(r => r.json())
  });
}
```

## Chart Library Selection

| Use Case | Library | Reason |
|----------|---------|--------|
| High-frequency updates | uPlot | Best performance for time-series |
| Rich interactions | ECharts | Best tooltip/click/hover support |
| Simple line charts | Recharts | Easiest React integration |

### uPlot Configuration

```typescript
// Factory pattern for consistent styling
function createBarChart(data: number[][], opts: Partial<uPlot.Options>) {
  return new uPlot({
    width: 800,
    height: 400,
    scales: { x: { time: false } },
    series: [
      {},
      {
        label: 'Opened',
        fill: '#22c55e',
        stroke: '#16a34a',
        paths: uPlot.paths.bars({ size: [0.6, 100] })
      },
      {
        label: 'Closed',
        fill: '#ef4444',
        stroke: '#dc2626',
        paths: uPlot.paths.bars({ size: [0.6, 100] })
      }
    ],
    ...opts
  }, data);
}
```

## Search Implementation

### Client-Side Indexed Search

```typescript
// Build search index on collection load
const searchIndex = new Map<string, SearchEntry[]>();

function buildSearchIndex(entries: SearchEntry[]) {
  entries.forEach(entry => {
    const terms = [
      entry.code.toLowerCase(),
      ...entry.name.toLowerCase().split(/\s+/)
    ];
    terms.forEach(term => {
      if (!searchIndex.has(term)) {
        searchIndex.set(term, []);
      }
      searchIndex.get(term)!.push(entry);
    });
  });
}

function search(query: string): SearchEntry[] {
  const term = query.toLowerCase();
  const exactMatch = searchIndex.get(term) || [];
  const prefixMatches = [...searchIndex.entries()]
    .filter(([key]) => key.startsWith(term))
    .flatMap(([, entries]) => entries);

  return [...new Set([...exactMatch, ...prefixMatches])].slice(0, 20);
}
```

## Performance Considerations

1. **Preload Critical Data**: Assets and Superinvestors loaded on app init
2. **Lazy Load Charts**: Chart libraries imported dynamically
3. **Virtual Scrolling**: For tables with >1000 rows
4. **Debounced Search**: 150ms debounce on search input
5. **Memoized Queries**: useMemo for computed collections
6. **Background Prefetch**: Load adjacent quarters on hover

## Error Handling Strategy

```typescript
// Consistent error boundary pattern
function withErrorBoundary<T>(Component: React.FC<T>) {
  return function WrappedComponent(props: T) {
    return (
      <ErrorBoundary fallback={<ErrorCard />}>
        <Suspense fallback={<LoadingSpinner />}>
          <Component {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  };
}
```

## Testing Strategy

1. **Unit Tests**: Chart data transformations, search logic
2. **Component Tests**: DataTable, GlobalSearch rendering
3. **Integration Tests**: Page load with mock Electric data
4. **E2E Tests**: Full user flows with Playwright

## Migration Path

1. Keep existing Electric + TanStack DB setup
2. Add new tables via Drizzle migrations
3. Implement collections one by one
4. Build pages incrementally
5. Remove old todo/counter demo at end
