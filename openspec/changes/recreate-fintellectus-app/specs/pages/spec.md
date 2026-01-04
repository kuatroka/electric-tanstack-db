# Spec: Page Components

## ADDED Requirements

### Requirement: Home Page
The system MUST provide a landing page at route `/`.

#### Scenario: Render home
- GIVEN user navigates to /
- THEN displays welcome message and app description
- AND shows quick links to Assets and Superinvestors

#### Scenario: Summary statistics
- GIVEN collections are synced
- THEN displays total asset count and total investor count

#### Scenario: Data freshness
- GIVEN data freshness is available
- THEN displays "Data as of: {date}"

---

### Requirement: Assets Page
The system MUST provide an assets list page at route `/assets`.

#### Scenario: Render assets page
- GIVEN user navigates to /assets
- THEN displays AllAssetsActivityChart at top
- AND displays AssetsTable below

#### Scenario: Table data
- GIVEN assets collection is synced
- THEN table shows all assets with search, sort, pagination

#### Scenario: Navigate to detail
- GIVEN user clicks on asset row
- THEN navigates to /assets/{code}/{cusip}

#### Scenario: Loading state
- GIVEN collection is syncing
- THEN shows loading skeleton for chart and table

---

### Requirement: Asset Detail Page
The system MUST provide an asset detail page at route `/assets/:code/:cusip`.

#### Scenario: Render detail page
- GIVEN user navigates to /assets/AAPL/123456789
- THEN displays page header with asset name and code
- AND displays InvestorActivityChart
- AND displays InvestorFlowChart
- AND displays DrilldownTable

#### Scenario: Drilldown interaction
- GIVEN user clicks on a bar in InvestorActivityChart
- THEN DrilldownTable updates to show that quarter/action

#### Scenario: Quarter selector
- GIVEN DrilldownTable is displayed
- THEN shows quarter dropdown to filter drilldown data

#### Scenario: Back navigation
- GIVEN user is on detail page
- WHEN user clicks back button
- THEN navigates to /assets

#### Scenario: Asset not found
- GIVEN cusip does not exist in collection
- THEN displays "Asset not found" error page

---

### Requirement: Superinvestors Page
The system MUST provide a superinvestors list page at route `/superinvestors`.

#### Scenario: Render superinvestors page
- GIVEN user navigates to /superinvestors
- THEN displays SuperinvestorsTable

#### Scenario: Table data
- GIVEN superinvestors collection is synced
- THEN table shows all investors with search, sort, pagination

#### Scenario: Navigate to detail
- GIVEN user clicks on investor row
- THEN navigates to /superinvestors/{cik}

---

### Requirement: Superinvestor Detail Page
The system MUST provide a superinvestor detail page at route `/superinvestors/:cik`.

#### Scenario: Render detail page
- GIVEN user navigates to /superinvestors/0001234567
- THEN displays page header with investor name and CIK
- AND displays PortfolioValueChart

#### Scenario: Portfolio chart
- GIVEN cik_quarterly data exists for CIK
- THEN chart shows portfolio value over time

#### Scenario: Back navigation
- GIVEN user is on detail page
- WHEN user clicks back button
- THEN navigates to /superinvestors

#### Scenario: Investor not found
- GIVEN CIK does not exist in collection
- THEN displays "Investor not found" error page

---

### Requirement: 404 Not Found Page
The system MUST provide an error page for unknown routes.

#### Scenario: Unknown route
- GIVEN user navigates to /unknown-path
- THEN displays "Page not found" message
- AND shows link to home page

---

### Requirement: Error Boundary
All pages MUST be wrapped in error boundary.

#### Scenario: Component error
- GIVEN a page component throws an error
- THEN error boundary catches it
- AND displays "Something went wrong" message
- AND shows "Try again" button

---

### Requirement: Page Loading States
All pages MUST show loading during data fetch.

#### Scenario: Initial load
- GIVEN page requires collection data
- WHEN collection is syncing
- THEN page shows loading skeleton or spinner

#### Scenario: Transition loading
- GIVEN user navigates between pages
- THEN shows brief loading indicator during transition

---

## Related Capabilities
- [Charts](../charts/spec.md): Charts embedded in detail pages
- [Tables](../tables/spec.md): Tables embedded in list pages
- [Navigation](../navigation/spec.md): Back buttons, route links
- [Collections](../collections/spec.md): Data source for pages
