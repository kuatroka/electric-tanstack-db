# Tasks: Recreate Fintellectus App

## Phase 1: Database & Backend Foundation

### 1.1 Database Schema
- [x] Create Drizzle schema file with all tables (assets, superinvestors, searches, activity_summary, cik_quarterly, investor_flow, drilldown_activity)
- [x] Add proper indexes for query performance
- [x] Generate and run Drizzle migrations
- [x] Seed database with sample 13F data (at least 100 assets, 50 superinvestors, 8 quarters of activity)
- [x] Verify Electric sync is working for all tables

### 1.2 API Endpoints Structure
- [x] Refactor Hono server structure to support multiple route files
- [x] Create `/api/assets` endpoint (GET all assets with pagination)
- [x] Create `/api/superinvestors` endpoint (GET all superinvestors with pagination)
- [x] Create `/api/superinvestors/:cik` endpoint (GET single superinvestor)
- [x] Create `/api/all-assets-activity` endpoint (aggregated opened/closed by quarter, optional cusip/ticker filter)
- [x] Create `/api/investor-flow` endpoint (inflow/outflow per quarter for a ticker)
- [x] Create `/api/cik-quarterly/:cik` endpoint (portfolio value over time)
- [x] Create `/api/drilldown/:ticker` endpoint (investor activity drilldown)
- [x] Create `/api/duckdb-investor-drilldown` endpoint (detailed drilldown rows)
- [x] Create `/api/search` endpoint (global search across assets and superinvestors)
- [x] Create `/api/data-freshness` endpoint (last data load date)
- [x] Add query timing to all API responses

### 1.3 TanStack DB Collections
- [ ] Create `assetsCollection` with Electric shape sync
- [ ] Create `superinvestorsCollection` with Electric shape sync
- [ ] Create `searchesCollection` with Electric shape sync
- [ ] Create `activitySummaryCollection` with Electric shape sync
- [ ] Create `cikQuarterlyCollection` with parameterized Electric shape
- [ ] Create `investorFlowCollection` with parameterized Electric shape
- [ ] Implement collection preloading on app initialization
- [ ] Add collection status indicators (loading, synced, error)

## Phase 2: UI Components Foundation

### 2.1 Shadcn/ui Components Setup
- [x] Install and configure Tailwind CSS v4
- [x] Install shadcn/ui CLI and initialize
- [x] Add Button component with all variants
- [x] Add Card component (Header, Title, Description, Content, Footer)
- [x] Add Input component
- [x] Add Select component
- [x] Add Badge component with variants
- [x] Add Dialog component
- [x] Add Command component (for search)
- [x] Add Table components (Table, TableHeader, TableBody, TableRow, TableHead, TableCell)

### 2.2 Core Layout Components
- [ ] Create `SiteLayout` component with header and main content area
- [ ] Create `GlobalNav` component with logo, search slot, and navigation links
- [ ] Add navigation link highlighting for current route
- [ ] Make layout responsive (mobile hamburger menu)
- [ ] Add theme support (light/dark mode toggle)

### 2.3 DataTable Component
- [ ] Create generic `DataTable<T>` component with TypeScript generics
- [ ] Implement column definition system with sortable/searchable flags
- [ ] Add client-side search filtering
- [ ] Add column header click sorting (asc/desc/none cycle)
- [ ] Implement pagination with First/Prev/Next/Last buttons
- [ ] Add page size selector (10, 25, 50, 100)
- [ ] Implement keyboard navigation (arrow keys, Enter to click)
- [ ] Add focus states and accessibility attributes
- [ ] Add loading skeleton state
- [ ] Add empty state message

### 2.4 Global Search Component
- [ ] Create `GlobalSearch` component using Command palette
- [ ] Implement debounced search (150ms)
- [ ] Build client-side search index from searches collection
- [ ] Display categorized results (Assets, Superinvestors)
- [ ] Add keyboard navigation in results
- [ ] Navigate to detail page on result selection
- [ ] Show search loading state
- [ ] Add "No results" state

### 2.5 Utility Components
- [ ] Create `LatencyBadge` component showing query timing
- [ ] Create `LoadingSpinner` component
- [ ] Create `ErrorCard` component for error states
- [ ] Create `EmptyState` component for no-data states

## Phase 3: Chart Components

### 3.1 Chart Libraries Setup
- [x] Install uPlot and create React wrapper component
- [x] Install ECharts and echarts-for-react
- [x] Install Recharts
- [x] Create chart theme configuration matching app design
- [x] Set up chart color palette (green for opened/inflow, red for closed/outflow)

### 3.2 uPlot Chart Factory
- [ ] Create `createBarChart` factory function
- [ ] Create `createLineChart` factory function
- [ ] Create `createAreaChart` factory function
- [ ] Implement chart resize handling
- [ ] Add tooltip formatting utilities
- [ ] Add axis label formatting (quarters, currency, numbers)

### 3.3 All Assets Activity Chart (ECharts)
- [ ] Create `AllAssetsActivityChart` component
- [ ] Fetch data from activitySummaryCollection (where cusip IS NULL)
- [ ] Implement stacked bar chart with opened (green) and closed (red)
- [ ] Add quarter labels on x-axis
- [ ] Add interactive tooltip showing counts
- [ ] Add click handler to filter assets table (optional)

### 3.4 Investor Activity Chart (uPlot)
- [ ] Create `InvestorActivityChart` component
- [ ] Accept cusip/ticker as prop
- [ ] Fetch data from activitySummaryCollection filtered by cusip
- [ ] Implement grouped bar chart (opened vs closed per quarter)
- [ ] Add click handler to show drilldown for specific quarter
- [ ] Add hover state highlighting

### 3.5 Investor Flow Chart (Recharts)
- [ ] Create `InvestorFlowChart` component
- [ ] Accept ticker as prop
- [ ] Fetch data from investorFlowCollection
- [ ] Implement line chart with inflow (green) and outflow (red) lines
- [ ] Add legend
- [ ] Add tooltip with formatted currency values

### 3.6 Portfolio Value Chart (uPlot)
- [ ] Create `PortfolioValueChart` component
- [ ] Accept cik as prop
- [ ] Fetch data from cikQuarterlyCollection
- [ ] Implement line chart showing total value over time
- [ ] Add secondary y-axis for percentage change (optional)
- [ ] Add tooltip with formatted values

### 3.7 Opened/Closed Bar Chart (Reusable ECharts)
- [ ] Create `OpenedClosedBarChart` reusable component
- [ ] Accept data array with quarter/opened/closed
- [ ] Implement horizontal or vertical bar options
- [ ] Add consistent styling with theme colors

## Phase 4: Page Implementation

### 4.1 Routing Setup
- [x] Configure TanStack Router with file-based routing
- [x] Create route tree structure matching reference app
- [x] Set up layout route with SiteLayout
- [x] Add route params typing for :code/:cusip and :cik
- [x] Implement 404 not found page

### 4.2 Home Page (`/`)
- [ ] Create `HomePage` component
- [ ] Add welcome message and app description
- [ ] Add quick links to Assets and Superinvestors
- [ ] Show data freshness indicator
- [ ] Add summary statistics (total assets, total investors)

### 4.3 Assets Page (`/assets`)
- [ ] Create `AssetsPage` component
- [ ] Integrate DataTable with assets collection data
- [ ] Configure columns: Code (clickable link), Name
- [ ] Add AllAssetsActivityChart above table
- [ ] Implement row click to navigate to asset detail
- [ ] Show total count and current page info
- [ ] Add loading state during collection sync

### 4.4 Asset Detail Page (`/assets/:code/:cusip`)
- [ ] Create `AssetDetailPage` component
- [ ] Parse route params and validate
- [ ] Fetch asset info from assets collection
- [ ] Add page header with asset name and code
- [ ] Integrate InvestorActivityChart
- [ ] Integrate InvestorFlowChart
- [ ] Add DrilldownTable component showing investor activity
- [ ] Implement quarter selector for drilldown
- [ ] Add back navigation button
- [ ] Handle asset not found state

### 4.5 Superinvestors Page (`/superinvestors`)
- [ ] Create `SuperinvestorsPage` component
- [ ] Integrate DataTable with superinvestors collection data
- [ ] Configure columns: CIK (clickable link), Name
- [ ] Implement row click to navigate to investor detail
- [ ] Show total count and current page info
- [ ] Add loading state during collection sync

### 4.6 Superinvestor Detail Page (`/superinvestors/:cik`)
- [ ] Create `SuperinvestorDetailPage` component
- [ ] Parse route params and validate
- [ ] Fetch investor info from superinvestors collection
- [ ] Add page header with investor name and CIK
- [ ] Integrate PortfolioValueChart
- [ ] Add holdings summary table (optional)
- [ ] Add back navigation button
- [ ] Handle investor not found state

### 4.7 Drilldown Table Component
- [ ] Create `DrilldownTable` component
- [ ] Accept cusip, quarter, action as props
- [ ] Fetch data from drilldown API endpoint
- [ ] Display columns: CIK, Investor Name, Action, Shares, Value
- [ ] Add sorting by value
- [ ] Add pagination for large result sets
- [ ] Show "No activity" state when empty

## Phase 5: Integration & Polish

### 5.1 Data Freshness & Sync Status
- [ ] Implement data freshness check on app load
- [ ] Add sync status indicator in GlobalNav
- [ ] Show "Syncing..." state during Electric sync
- [ ] Add manual refresh button
- [ ] Implement stale data warning

### 5.2 Error Handling
- [ ] Add error boundaries around pages
- [ ] Implement API error handling with retry logic
- [ ] Add collection sync error handling
- [ ] Show user-friendly error messages
- [ ] Add error logging (console in dev)

### 5.3 Loading States
- [ ] Add skeleton loaders for DataTable
- [ ] Add skeleton loaders for charts
- [ ] Add page-level loading states
- [ ] Implement progressive loading (show what's available)

### 5.4 Performance Optimization
- [ ] Implement React.memo for expensive components
- [ ] Add virtual scrolling for tables with >500 rows
- [ ] Lazy load chart libraries
- [ ] Optimize collection queries with proper indexes
- [ ] Add query caching strategies
- [ ] Profile and fix any render bottlenecks

### 5.5 Testing
- [ ] Write unit tests for search index building
- [ ] Write unit tests for chart data transformations
- [ ] Write component tests for DataTable
- [ ] Write component tests for GlobalSearch
- [ ] Write integration tests for page rendering
- [ ] Add E2E tests for critical user flows

### 5.6 Cleanup
- [ ] Remove old todo/counter demo components
- [ ] Remove unused dependencies
- [ ] Update project.md with final architecture
- [ ] Update README with setup instructions
- [ ] Verify production build works
- [ ] Test all routes with browser dev tools

## Dependencies Between Tasks

```
Phase 1 (Foundation)
├── 1.1 Database Schema ──────────────┐
├── 1.2 API Endpoints ←── 1.1        │
└── 1.3 Collections ←── 1.1, 1.2     │
                                      │
Phase 2 (UI Components)               │
├── 2.1 Shadcn/ui Setup              │
├── 2.2 Layout Components ←── 2.1    │
├── 2.3 DataTable ←── 2.1            │
├── 2.4 Global Search ←── 2.1, 1.3   │
└── 2.5 Utility Components ←── 2.1   │
                                      │
Phase 3 (Charts)                      │
├── 3.1 Chart Libraries Setup        │
├── 3.2 uPlot Factory ←── 3.1        │
├── 3.3 AllAssetsActivityChart ←── 3.1, 1.3
├── 3.4 InvestorActivityChart ←── 3.2, 1.3
├── 3.5 InvestorFlowChart ←── 3.1, 1.3
├── 3.6 PortfolioValueChart ←── 3.2, 1.3
└── 3.7 OpenedClosedBarChart ←── 3.1 │
                                      │
Phase 4 (Pages) ←── Phase 2, 3       │
├── 4.1 Routing Setup                │
├── 4.2 Home Page ←── 2.2, 4.1       │
├── 4.3 Assets Page ←── 2.3, 3.3, 4.1
├── 4.4 Asset Detail ←── 3.4, 3.5, 4.7
├── 4.5 Superinvestors Page ←── 2.3, 4.1
├── 4.6 Superinvestor Detail ←── 3.6, 4.1
└── 4.7 Drilldown Table ←── 2.3, 1.2 │
                                      │
Phase 5 (Polish) ←── Phase 4         │
├── 5.1 Data Freshness               │
├── 5.2 Error Handling               │
├── 5.3 Loading States               │
├── 5.4 Performance                  │
├── 5.5 Testing                      │
└── 5.6 Cleanup                      │
```

## Parallelization Opportunities

These task groups can be worked on in parallel:

1. **Group A** (Backend): 1.1 → 1.2 → 1.3
2. **Group B** (UI Foundation): 2.1 → 2.2 + 2.3 + 2.5 (parallel) → 2.4
3. **Group C** (Charts): 3.1 → 3.2 → 3.3 + 3.4 + 3.5 + 3.6 + 3.7 (parallel)

After Phase 1 completes, Groups B and C can proceed in parallel.

## Verification Checklist

After all tasks complete:
- [ ] All 5 routes load without errors
- [ ] Assets table displays 100+ assets with search/sort/pagination working
- [ ] Superinvestors table displays 50+ investors with search/sort/pagination working
- [ ] Global search returns instant results for both categories
- [ ] All 4 chart types render correctly with data
- [ ] Asset detail page shows all charts with drilldown
- [ ] Superinvestor detail page shows portfolio value chart
- [ ] Data syncs from Electric in real-time
- [ ] No console errors in production build
- [ ] All pages are responsive on mobile
