# Spec: API Endpoints

## ADDED Requirements

### Requirement: Assets List Endpoint
The system MUST provide `GET /api/assets` that returns all assets with optional pagination.

#### Scenario: Fetch all assets
- GIVEN assets exist in database
- WHEN GET /api/assets
- THEN returns JSON array with id, code, cusip, name for each asset
- AND includes queryTimeMs in response

#### Scenario: Paginated fetch
- GIVEN 1000+ assets exist
- WHEN GET /api/assets?limit=50&offset=100
- THEN returns 50 assets starting from offset 100
- AND includes total count in response

---

### Requirement: Superinvestors List Endpoint
The system MUST provide `GET /api/superinvestors` that returns all superinvestors with optional pagination.

#### Scenario: Fetch all superinvestors
- GIVEN superinvestors exist in database
- WHEN GET /api/superinvestors
- THEN returns JSON array with id, cik, name, ticker, active_periods

#### Scenario: Fetch single superinvestor
- GIVEN superinvestor with CIK "0001234567" exists
- WHEN GET /api/superinvestors/0001234567
- THEN returns single investor object with full details

---

### Requirement: All Assets Activity Endpoint
The system MUST provide `GET /api/all-assets-activity` that returns aggregated activity by quarter.

#### Scenario: Global activity
- GIVEN activity_summary contains aggregate data
- WHEN GET /api/all-assets-activity
- THEN returns array of { quarter, opened, closed } for all quarters

#### Scenario: Filtered by asset
- GIVEN activity data exists for CUSIP "123456789"
- WHEN GET /api/all-assets-activity?cusip=123456789
- THEN returns activity only for that CUSIP

#### Scenario: Filtered by ticker
- GIVEN activity data exists for ticker "AAPL"
- WHEN GET /api/all-assets-activity?ticker=AAPL
- THEN returns activity only for that ticker

---

### Requirement: Investor Flow Endpoint
The system MUST provide `GET /api/investor-flow` that returns inflow/outflow per quarter.

#### Scenario: Flow data for ticker
- GIVEN investor_flow contains data for "MSFT"
- WHEN GET /api/investor-flow?ticker=MSFT
- THEN returns array of { quarter, inflow, outflow }

---

### Requirement: CIK Quarterly Endpoint
The system MUST provide `GET /api/cik-quarterly/:cik` that returns portfolio value time series.

#### Scenario: Portfolio history
- GIVEN cik_quarterly contains data for CIK "0001234567"
- WHEN GET /api/cik-quarterly/0001234567
- THEN returns array of { quarter, totalValue, totalValuePrcChg, numAssets }

---

### Requirement: Drilldown Endpoint
The system MUST provide `GET /api/drilldown/:ticker` that returns investor activity details.

#### Scenario: Drilldown data
- GIVEN drilldown_activity contains data for ticker "GOOGL"
- WHEN GET /api/drilldown/GOOGL?quarter=2024-Q1&action=open
- THEN returns array of { cik, cikName, shares, value }

#### Scenario: Drilldown summary
- GIVEN drilldown_activity contains data for ticker "GOOGL"
- WHEN GET /api/drilldown/GOOGL/summary
- THEN returns counts per quarter per action type

---

### Requirement: Search Endpoint
The system MUST provide `GET /api/search` that returns search results across all entities.

#### Scenario: Search by term
- GIVEN searches contains "Apple Inc" asset and "Apple Capital" investor
- WHEN GET /api/search?q=apple
- THEN returns both matches grouped by category

---

### Requirement: Data Freshness Endpoint
The system MUST provide `GET /api/data-freshness` that returns data load timestamp.

#### Scenario: Check freshness
- GIVEN database was last loaded on 2024-01-15
- WHEN GET /api/data-freshness
- THEN returns { lastDataLoadDate: "2024-01-15", version: "1.0" }

---

### Requirement: Query Timing
All endpoints MUST include query execution time in the response.

#### Scenario: Timing header
- GIVEN any API endpoint
- WHEN request is processed
- THEN response includes queryTimeMs field with milliseconds

---

## Related Capabilities
- [Database Schema](../database-schema/spec.md): Queries these tables
- [Collections](../collections/spec.md): Frontend fetches from these endpoints
