# Spec: TanStack DB Collections

## ADDED Requirements

### Requirement: Assets Collection
The system MUST provide a preloaded collection of all assets with Electric sync.

#### Scenario: Initial load
- GIVEN app starts
- WHEN assetsCollection initializes
- THEN syncs all assets from Electric shape
- AND stores in local IndexedDB

#### Scenario: Query all assets
- GIVEN collection is synced
- WHEN useLiveQuery queries all assets
- THEN returns array from local store (sub-millisecond)

#### Scenario: Real-time update
- GIVEN collection is synced
- WHEN new asset is added to PostgreSQL
- THEN collection updates automatically via Electric

---

### Requirement: Superinvestors Collection
The system MUST provide a preloaded collection of all superinvestors with Electric sync.

#### Scenario: Initial load
- GIVEN app starts
- WHEN superinvestorsCollection initializes
- THEN syncs all superinvestors from Electric shape

#### Scenario: Query by CIK
- GIVEN collection is synced
- WHEN query filters by cik
- THEN returns matching investor immediately

---

### Requirement: Searches Collection
The system MUST provide a collection for global search index.

#### Scenario: Search index ready
- GIVEN collection is synced
- WHEN buildSearchIndex() is called
- THEN creates in-memory hash map for instant lookups

#### Scenario: Prefix search
- GIVEN search index is built
- WHEN search("app") is called
- THEN returns all entries where code or name starts with "app"

---

### Requirement: Activity Summary Collection
The system MUST provide a collection for aggregated activity data.

#### Scenario: Global activity query
- GIVEN collection is synced
- WHEN query filters where cusip IS NULL
- THEN returns aggregate activity for all assets

#### Scenario: Asset-specific activity
- GIVEN collection is synced
- WHEN query filters by specific cusip
- THEN returns activity for that asset only

---

### Requirement: CIK Quarterly Collection
The system MUST provide a parameterized collection for portfolio value time series.

#### Scenario: Load for specific CIK
- GIVEN cik parameter is provided
- WHEN collection syncs with Electric shape where cik=$cik
- THEN loads only data for that investor

---

### Requirement: Investor Flow Collection
The system MUST provide a parameterized collection for inflow/outflow data.

#### Scenario: Load for specific ticker
- GIVEN ticker parameter is provided
- WHEN collection syncs with Electric shape where ticker=$ticker
- THEN loads only flow data for that asset

---

### Requirement: Collection Preloading
The system MUST preload critical collections on app initialization.

#### Scenario: App startup
- GIVEN user navigates to app
- WHEN AppProvider mounts
- THEN assets, superinvestors, searches collections begin syncing
- AND loading state shown until complete

---

### Requirement: Collection Status
Collections MUST expose sync status.

#### Scenario: Sync in progress
- GIVEN collection is actively syncing
- WHEN status is queried
- THEN returns { syncing: true, count: 150, total: 500 }

#### Scenario: Sync complete
- GIVEN collection finished syncing
- WHEN status is queried
- THEN returns { syncing: false, count: 500, total: 500 }

---

## Related Capabilities
- [Database Schema](../database-schema/spec.md): Source of synced data
- [API Endpoints](../api-endpoints/spec.md): Fallback for complex queries
- [Tables](../tables/spec.md): Uses collections for data
- [Charts](../charts/spec.md): Uses collections for data
