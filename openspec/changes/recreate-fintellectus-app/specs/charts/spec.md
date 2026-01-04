# Spec: Chart Components

## ADDED Requirements

### Requirement: All Assets Activity Chart
The system MUST provide an ECharts bar chart showing opened vs closed positions across all assets.

#### Scenario: Render chart
- GIVEN activity summary data exists
- WHEN AllAssetsActivityChart mounts
- THEN displays stacked bar chart with quarters on x-axis
- AND green bars for opened positions
- AND red bars for closed positions

#### Scenario: Tooltip interaction
- GIVEN chart is rendered
- WHEN user hovers over a bar
- THEN tooltip shows quarter, opened count, closed count

#### Scenario: Empty state
- GIVEN no activity data exists
- WHEN chart mounts
- THEN displays "No activity data available" message

---

### Requirement: Investor Activity Chart
The system MUST provide a uPlot bar chart showing activity for a specific asset.

#### Scenario: Render for asset
- GIVEN cusip/ticker prop is provided
- WHEN InvestorActivityChart mounts
- THEN displays grouped bars (opened vs closed) per quarter

#### Scenario: Click to drill down
- GIVEN chart is rendered
- WHEN user clicks on a bar
- THEN onQuarterSelect callback fires with { quarter, action }

#### Scenario: Hover highlight
- GIVEN chart is rendered
- WHEN user hovers over a quarter
- THEN that quarter's bars are highlighted

---

### Requirement: Investor Flow Chart
The system MUST provide a Recharts line chart showing inflow/outflow over time.

#### Scenario: Render for ticker
- GIVEN ticker prop is provided
- WHEN InvestorFlowChart mounts
- THEN displays two lines: green for inflow, red for outflow

#### Scenario: Legend
- GIVEN chart is rendered
- THEN legend shows "Inflow" and "Outflow" labels

#### Scenario: Tooltip formatting
- GIVEN chart is rendered
- WHEN user hovers over a point
- THEN tooltip shows formatted currency values ($X,XXX,XXX)

---

### Requirement: Portfolio Value Chart
The system MUST provide a uPlot line chart showing portfolio value over time.

#### Scenario: Render for CIK
- GIVEN cik prop is provided
- WHEN PortfolioValueChart mounts
- THEN displays line chart of total value over quarters

#### Scenario: Value formatting
- GIVEN chart displays large values
- THEN y-axis shows formatted values (e.g., $1.5B, $250M)

#### Scenario: Percentage change
- GIVEN chart has percentage change data
- THEN optionally shows secondary y-axis with % change

---

### Requirement: Opened/Closed Bar Chart (Reusable)
The system MUST provide a configurable ECharts bar chart for opened vs closed visualization.

#### Scenario: Vertical bars
- GIVEN orientation="vertical" prop
- WHEN chart renders
- THEN displays vertical bars with quarters on x-axis

#### Scenario: Horizontal bars
- GIVEN orientation="horizontal" prop
- WHEN chart renders
- THEN displays horizontal bars with quarters on y-axis

#### Scenario: Custom colors
- GIVEN openedColor and closedColor props
- WHEN chart renders
- THEN uses provided colors instead of defaults

---

### Requirement: Chart Responsive Sizing
All charts MUST handle container resize.

#### Scenario: Container resize
- GIVEN chart is rendered in a container
- WHEN container width changes (e.g., window resize)
- THEN chart resizes to fit container width

---

### Requirement: Chart Loading State
All charts MUST show loading state while data fetches.

#### Scenario: Loading
- GIVEN chart data is not yet available
- WHEN chart mounts
- THEN displays loading skeleton or spinner

---

### Requirement: Chart Theme Integration
All charts MUST use consistent theming.

#### Scenario: Light theme
- GIVEN app is in light mode
- WHEN charts render
- THEN use light theme colors and backgrounds

#### Scenario: Dark theme
- GIVEN app is in dark mode
- WHEN charts render
- THEN use dark theme colors and backgrounds

---

## Related Capabilities
- [Collections](../collections/spec.md): Data source for charts
- [Pages](../pages/spec.md): Charts embedded in pages
