# Tasks: Add Global Search Feature

## 1. Dependencies Setup
- [x] 1.1 Install react-router-dom (`bun add react-router-dom`)
- [x] 1.2 Install shadcn/ui Button component (`bunx shadcn-ui@latest add button`)
- [x] 1.3 Install shadcn/ui Input component (`bunx shadcn-ui@latest add input`)
- [x] 1.4 Verify installations in package.json and tsconfig

## 2. Electric Integration
- [x] 2.1 Add 'searches' shape stream to src/lib/electric.ts
  - Export `createSearchShape()` function
  - Return Shape<SearchResult> with proper typing
  - Use lazy initialization (subscribe on first search interaction)
- [x] 2.2 Update src/lib/collections.ts with Search interface and types
  - Define `interface Search { id: number; code: string; name?: string; category: string; cusip?: string; }`
  - Export type for use in components

## 3. Search Hook
- [x] 3.1 Create src/hooks/useSearch.ts hook
  - Implement `useSearch(query: string)` hook
  - Return `{ results: Search[], isLoading: boolean, error?: string }`
  - Check query length: if <2 chars, return empty results with placeholder message
  - If ≥2 chars, execute pglite query instantly using Electric shape
  - Limit results to first 10 matches
  - Filter by code/name fields (case-insensitive substring match)
- [x] 3.2 Write unit tests for useSearch hook
  - Test minimum 2-character requirement behavior
  - Test filtering logic (code, name, case-insensitive)
  - Test empty results
  - Test result limit (10 max)
  - Test instant execution (no debouncing)

## 4. Global Search Component
- [x] 4.1 Create src/components/GlobalSearch.tsx component
  - Accept no props (global state)
  - Render fixed sticky header at top
  - Use shadcn/ui Input for search field
  - Show placeholder text "Type at least 2 characters" when input.length < 2
  - Display dropdown below input showing results when input.length ≥ 2
  - Show "No results found" when query ≥2 chars but has no matches
  - Show loading state while fetching (should be instant with pglite)
- [x] 4.2 Implement result selection behavior
  - On result click, navigate to detail page
  - Close dropdown after selection
  - Clear search input after selection
  - Prevent default link behavior and use router.push
- [x] 4.3 Implement keyboard navigation
  - Arrow up/down to navigate result list
  - Enter to select highlighted result
  - Escape to close dropdown

## 5. Detail Page Component
- [x] 5.1 Create src/pages/DetailPage.tsx component
  - Accept route params: code (required), cusip (optional)
  - Display empty state page
  - Show code and cusip in header (if provided)
  - Render placeholder for future data display
- [x] 5.2 Add TypeScript types for detail page props
  - Extract params from useParams hook
  - Handle undefined cusip gracefully

## 6. Routing Setup
- [x] 6.1 Create src/routes/index.tsx (or integrate into src/App.tsx)
  - Set up BrowserRouter wrapper
  - Define routes for all pages:
    - `/` - Home/default view (existing App content)
    - `/category/:code` - Detail page for superinvestor
    - `/category/:code/:cusip` - Detail page for asset
  - Add 404 fallback route
- [x] 6.2 Update src/App.tsx to use Router
  - Wrap existing content with RouterProvider or BrowserRouter
  - Add GlobalSearch component at root level (outside route outlets)
  - Render <Outlet /> for route-specific content
- [x] 6.3 Update src/main.tsx if needed for router initialization

## 7. Styling & UX
- [x] 7.1 Style GlobalSearch component
  - Fixed position sticky header with z-index
  - Dropdown positioned below input
  - Hover state for result items
  - Selected state for keyboard navigation highlight
- [x] 7.2 Style DetailPage component
  - Empty state placeholder styling
  - Show code/cusip in readable format
  - Add "Back to Home" button or breadcrumb
- [x] 7.3 Add responsive design
  - Mobile-friendly input sizing
  - Dropdown scrollable on mobile
  - Touch-friendly result item height (min 44px)

## 8. Testing
- [x] 8.1 Manual testing of search functionality
  - Type single character, verify no results and placeholder shows "Type at least 2 characters"
  - Type second character, verify results appear instantly
  - Verify offline search works (disconnect network, search still works)
  - Test with various query strings (exact match, substring, case variations)
- [x] 8.2 Manual testing of navigation
  - Click asset result, verify route `/category/{code}/{cusip}`
  - Click superinvestor result, verify route `/category/{code}`
  - Verify DetailPage params are correct
  - Test browser back button functionality
- [x] 8.3 Manual testing of UI/UX
  - Verify GlobalSearch visible on all pages
  - Verify dropdown closes on selection
  - Verify search input clears on selection
  - Test keyboard navigation (arrow keys, enter, escape)
  - Test on mobile/tablet viewport sizes
- [x] 8.4 Browser console testing
  - Verify no errors in console
  - Verify no network requests for search queries
  - Check Electric sync logs for shape subscription

## 9. Documentation
- [x] 9.1 Update README with search feature documentation
  - Explain how to use global search
  - Document routes: /category/:code and /category/:code/:cusip
  - Note offline-capable search capability
- [x] 9.2 Add code comments to complex functions
  - Debounce logic in useSearch
  - pglite query execution in shape
  - Route param extraction in DetailPage

## 10. Quality Gate
- [x] 10.1 Run TypeScript compiler check (`bun run build`)
- [x] 10.2 Run linter if configured (`bun run lint` or eslint)
- [x] 10.3 Verify no console errors in browser dev tools
- [x] 10.4 Verify app builds successfully
- [x] 10.5 Test on at least two browser tabs (verify sync works)
