# Specification: Search Feature

## ADDED Requirements

### Requirement: Global Search Synchronization
The system SHALL synchronize the 'searches' table from PostgreSQL to the client-side pglite database via Electric SQL, enabling local offline-capable searches.

#### Scenario: Searches table syncs on app load
- **WHEN** the app initializes
- **THEN** the Electric shape stream for 'searches' table is created (lazy on first search interaction)
- **AND** data syncs to pglite replica without blocking initial render

#### Scenario: Search data updates reactively
- **WHEN** new records are inserted in PostgreSQL
- **THEN** Electric syncs the changes to the client within 2 seconds
- **AND** search results reflect the new data immediately

### Requirement: Global Search Input Component
The system SHALL provide a sticky global search input in the top navigation bar accessible from all pages.

#### Scenario: Search input visible on every page
- **WHEN** user navigates to any route
- **THEN** the GlobalSearch component renders in a fixed position at the top
- **AND** search input is focused after user types

#### Scenario: Search input accepts user input
- **WHEN** user types in the search field
- **THEN** if <2 characters, no results shown (placeholder text: "Type at least 2 characters")
- **AND** if ≥2 characters, results are fetched instantly from pglite without network request
- **AND** dropdown appears showing results sorted by code

### Requirement: Search Filtering on code and name Fields
The system SHALL filter 'searches' table records based on substring match in 'code' or 'name' fields.

#### Scenario: Filter by code
- **WHEN** user types "AAPL" in search
- **THEN** results include records where code contains "AAPL" (case-insensitive)
- **AND** results are limited to first 10 matches

#### Scenario: Filter by name
- **WHEN** user types "Apple" in search
- **THEN** results include records where name contains "Apple" (case-insensitive)
- **AND** results include code, name, category, and cusip fields

#### Scenario: Empty results
- **WHEN** user types a string with no matches
- **THEN** dropdown shows "No results found"
- **AND** search input remains focused

### Requirement: Search Result Navigation
The system SHALL navigate to detail pages when user selects a search result.

#### Scenario: Navigate to asset detail page
- **WHEN** user clicks a result with category='asset'
- **THEN** app navigates to `/category/{code}/{cusip}`
- **AND** DetailPage component mounts with code and cusip from URL params

#### Scenario: Navigate to superinvestor detail page
- **WHEN** user clicks a result with category='superinvestor'
- **THEN** app navigates to `/category/{code}`
- **AND** DetailPage component mounts with code from URL params

#### Scenario: Close dropdown on selection
- **WHEN** user selects a result
- **THEN** dropdown closes automatically
- **AND** search input is cleared
- **AND** page navigation occurs

### Requirement: Detail Page Routes
The system SHALL provide detail page routes for viewing search results, with empty state display.

#### Scenario: Detail page for asset (with cusip)
- **WHEN** user navigates to `/category/AAPL/037833100`
- **THEN** DetailPage component renders with code="AAPL" and cusip="037833100"
- **AND** page displays empty state (no data fetched from route)

#### Scenario: Detail page for superinvestor (no cusip)
- **WHEN** user navigates to `/category/AAPL`
- **THEN** DetailPage component renders with code="AAPL" and cusip=undefined
- **AND** page displays empty state

#### Scenario: Invalid route redirects
- **WHEN** user navigates to invalid detail route
- **THEN** app shows 404 error or redirects to home

### Requirement: Performance Optimization
The system SHALL execute searches locally with sub-10ms response time, eliminating network latency.

#### Scenario: Search executes locally
- **WHEN** user types in search input
- **THEN** pglite query executes on the client-side replica
- **AND** no HTTP request is made to the server
- **AND** response time is <10ms

#### Scenario: Offline search works
- **WHEN** user is offline (no network connection)
- **THEN** search still executes using cached pglite data
- **AND** results are accurate and complete

#### Scenario: Minimum 2-character requirement prevents single-character noise
- **WHEN** user types a single character (e.g., "A")
- **THEN** dropdown does not show results
- **AND** placeholder text displays: "Type at least 2 characters"
- **WHEN** user types a second character (e.g., "AP")
- **THEN** results are fetched instantly and dropdown displays matching records

### Requirement: Search Independence
The system SHALL keep search feature completely separate from projects/todos features.

#### Scenario: Search does not depend on projects/todos
- **WHEN** projects/todos features are disabled or removed
- **THEN** search functionality remains unaffected
- **AND** searches shape and queries are isolated from project/todo code

#### Scenario: Search results show only searches table data
- **WHEN** user performs a search
- **THEN** results are from 'searches' table only
- **AND** no project or todo records appear in search results
- **AND** no filtering or joining with projects/todos occurs
