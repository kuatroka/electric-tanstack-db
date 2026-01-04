# Spec: Table Components

## ADDED Requirements

### Requirement: Generic DataTable Component
The system MUST provide a reusable table with search, sort, and pagination.

#### Scenario: Render with data
- GIVEN DataTable receives data array and column definitions
- WHEN component mounts
- THEN displays table with headers and rows

#### Scenario: Column sorting
- GIVEN sortable column is clicked
- WHEN header is clicked once
- THEN sorts ascending by that column
- WHEN header is clicked again
- THEN sorts descending
- WHEN header is clicked third time
- THEN removes sort (returns to original order)

#### Scenario: Search filtering
- GIVEN searchable columns are defined
- WHEN user types in search input
- THEN table filters to rows matching search term in any searchable column

#### Scenario: Pagination navigation
- GIVEN more rows than page size
- WHEN First/Prev/Next/Last buttons are clicked
- THEN table shows corresponding page of data

#### Scenario: Page size selection
- GIVEN page size selector shows options [10, 25, 50, 100]
- WHEN user selects new page size
- THEN table adjusts rows per page and resets to page 1

#### Scenario: Keyboard navigation
- GIVEN table has focus
- WHEN user presses Arrow Down
- THEN focus moves to next row
- WHEN user presses Arrow Up
- THEN focus moves to previous row
- WHEN user presses Enter
- THEN triggers row click action

#### Scenario: Loading state
- GIVEN data is loading
- WHEN table renders
- THEN displays skeleton rows

#### Scenario: Empty state
- GIVEN data array is empty
- WHEN table renders
- THEN displays "No results found" message

---

### Requirement: Assets Table
The system MUST provide a DataTable configured for assets display.

#### Scenario: Column configuration
- GIVEN AssetsTable renders
- THEN displays columns: Code (sortable, searchable, clickable), Name (sortable, searchable)

#### Scenario: Row click navigation
- GIVEN user clicks on asset row
- THEN navigates to /assets/{code}/{cusip}

---

### Requirement: Superinvestors Table
The system MUST provide a DataTable configured for superinvestors display.

#### Scenario: Column configuration
- GIVEN SuperinvestorsTable renders
- THEN displays columns: CIK (sortable, searchable, clickable), Name (sortable, searchable)

#### Scenario: Row click navigation
- GIVEN user clicks on investor row
- THEN navigates to /superinvestors/{cik}

---

### Requirement: Drilldown Table
The system MUST provide a table showing investor activity for specific quarter/action.

#### Scenario: Render drilldown
- GIVEN cusip, quarter, action props provided
- WHEN DrilldownTable mounts
- THEN fetches and displays investor activity data

#### Scenario: Column configuration
- GIVEN DrilldownTable renders
- THEN displays columns: CIK, Investor Name, Action, Shares, Value

#### Scenario: Value formatting
- GIVEN drilldown data includes large values
- THEN Value column displays formatted currency ($X,XXX,XXX)

#### Scenario: Empty result
- GIVEN no investors have that action in that quarter
- WHEN table renders
- THEN displays "No activity for this selection" message

---

### Requirement: Accessibility
All tables MUST meet accessibility standards.

#### Scenario: Screen reader support
- GIVEN table is rendered
- THEN includes proper ARIA attributes (role="table", aria-label)
- AND column headers have scope="col"

#### Scenario: Focus management
- GIVEN user tabs into table
- THEN focus ring is visible on focused element
- AND focus is trapped within table during keyboard navigation

---

## Related Capabilities
- [Collections](../collections/spec.md): Data source for tables
- [Navigation](../navigation/spec.md): Row clicks trigger navigation
- [Pages](../pages/spec.md): Tables embedded in pages
