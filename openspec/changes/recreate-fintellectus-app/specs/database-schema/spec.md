# Spec: Database Schema

## ADDED Requirements

### Requirement: Assets Table
The system MUST store asset master data with unique identifiers.

#### Scenario: Asset lookup by ticker
- GIVEN assets table exists with populated data
- WHEN querying by code (ticker symbol)
- THEN returns asset with id, code, cusip, name, sector, created_at

#### Scenario: Asset lookup by CUSIP
- GIVEN assets table exists with populated data
- WHEN querying by cusip
- THEN returns unique asset record

---

### Requirement: Superinvestors Table
The system MUST store superinvestor (13F filer) master data.

#### Scenario: Superinvestor lookup by CIK
- GIVEN superinvestors table exists with populated data
- WHEN querying by cik
- THEN returns investor with id, cik, name, ticker, active_periods, created_at

---

### Requirement: Searches Table
The system MUST maintain a global search index.

#### Scenario: Search index lookup
- GIVEN searches table with assets and superinvestors indexed
- WHEN querying by code or name partial match
- THEN returns matching entries with category (assets/superinvestors)

---

### Requirement: Activity Summary Table
The system MUST store pre-aggregated activity counts by quarter.

#### Scenario: All assets activity query
- GIVEN activity_summary with cusip=NULL entries
- WHEN querying for global activity
- THEN returns opened, closed, added, reduced, held counts per quarter

#### Scenario: Single asset activity query
- GIVEN activity_summary with specific cusip entries
- WHEN querying filtered by cusip
- THEN returns activity counts for that asset only

---

### Requirement: CIK Quarterly Table
The system MUST store portfolio value time series per investor.

#### Scenario: Portfolio value history
- GIVEN cik_quarterly with data for a CIK
- WHEN querying by cik ordered by quarter
- THEN returns time series of total_value, total_value_prc_chg, num_assets

---

### Requirement: Investor Flow Table
The system MUST store inflow/outflow per asset per quarter.

#### Scenario: Flow data query
- GIVEN investor_flow with data for a ticker
- WHEN querying by ticker
- THEN returns inflow and outflow amounts per quarter

---

### Requirement: Drilldown Activity Table
The system MUST store detailed investor-level activity.

#### Scenario: Drilldown query
- GIVEN drilldown_activity with detailed records
- WHEN querying by cusip, quarter, and action
- THEN returns list of investors with cik, name, action, shares, value

---

### Requirement: Electric SQL Sync
All tables MUST be configured for Electric SQL real-time synchronization.

#### Scenario: Real-time data sync
- GIVEN Electric SQL is running and connected to PostgreSQL
- WHEN data is inserted/updated in any table
- THEN changes sync to connected clients within 100ms

---

## Related Capabilities
- [API Endpoints](../api-endpoints/spec.md): Uses these tables for queries
- [Collections](../collections/spec.md): Syncs data from these tables
