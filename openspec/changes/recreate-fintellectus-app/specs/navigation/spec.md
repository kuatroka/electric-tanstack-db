# Spec: Navigation Components

## ADDED Requirements

### Requirement: Global Navigation Bar
The system MUST provide a fixed header with logo, search, and navigation links.

#### Scenario: Render navigation
- GIVEN GlobalNav component mounts
- THEN displays: logo (left), search (center), nav links (right)

#### Scenario: Logo link
- GIVEN user clicks logo
- THEN navigates to home page (/)

#### Scenario: Nav link highlighting
- GIVEN current route is /assets
- THEN "Assets" link shows active state (underline, different color)

#### Scenario: Responsive behavior
- GIVEN viewport is mobile width (<768px)
- THEN shows hamburger menu instead of inline links

---

### Requirement: Site Layout
The system MUST provide a wrapper component for consistent page structure.

#### Scenario: Layout structure
- GIVEN SiteLayout wraps page content
- THEN renders GlobalNav at top
- AND renders page content below in main area

#### Scenario: Content ready
- GIVEN collections are still syncing
- THEN content area shows loading indicator
- WHEN collections finish syncing
- THEN content becomes visible

---

### Requirement: Global Search
The system MUST provide a command palette style search in navigation.

#### Scenario: Search input
- GIVEN GlobalSearch is rendered in nav
- THEN displays search input with placeholder "Search assets or investors..."

#### Scenario: Debounced search
- GIVEN user types "app"
- WHEN 150ms passes without more typing
- THEN search executes and shows results

#### Scenario: Categorized results
- GIVEN search finds "Apple Inc" asset and "Apple Capital" investor
- THEN results grouped under "Assets" and "Superinvestors" headers

#### Scenario: Result selection
- GIVEN search results are displayed
- WHEN user clicks on "Apple Inc" asset result
- THEN navigates to /assets/AAPL/123456789
- AND search closes

#### Scenario: Keyboard navigation
- GIVEN search results are displayed
- WHEN user presses Arrow Down/Up
- THEN selection moves through results
- WHEN user presses Enter
- THEN navigates to selected result

#### Scenario: Empty results
- GIVEN search term has no matches
- THEN displays "No results found for '{term}'"

#### Scenario: Keyboard shortcut
- GIVEN user presses Cmd+K (Mac) or Ctrl+K (Windows)
- THEN search input receives focus

---

### Requirement: Navigation Links
The system MUST provide links to main sections of the app.

#### Scenario: Link targets
- GIVEN GlobalNav is rendered
- THEN includes links to: / (Home), /assets (Assets), /superinvestors (Superinvestors)

#### Scenario: Active state
- GIVEN user is on /assets page
- THEN Assets link has active styling
- AND other links have default styling

---

### Requirement: Sync Status Indicator
The system MUST show Electric sync status in navigation.

#### Scenario: Syncing state
- GIVEN collections are actively syncing
- THEN shows spinning indicator with "Syncing..."

#### Scenario: Synced state
- GIVEN all collections are synced
- THEN shows green checkmark with "Up to date"

#### Scenario: Error state
- GIVEN sync encountered an error
- THEN shows red indicator with "Sync error"
- AND clicking shows error details

---

### Requirement: Theme Toggle
The system MUST provide a button to switch between light and dark mode.

#### Scenario: Toggle theme
- GIVEN app is in light mode
- WHEN user clicks theme toggle
- THEN app switches to dark mode
- AND preference is saved to localStorage

---

## Related Capabilities
- [Collections](../collections/spec.md): Sync status from collections
- [Pages](../pages/spec.md): Navigation links to pages
