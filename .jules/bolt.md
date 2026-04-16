## 2024-06-03 - Combine Supabase Queries for Dependent Metrics
**Learning:** In dashboards or overviews, fetching multiple dependent metrics (e.g., employee count, department stats, attrition count) via individual React Query `useQuery` calls results in an N+1-like network problem to Supabase. Even if run in parallel, it generates redundant queries on the same table (e.g., `employees`).
**Action:** Always inspect dashboard components for redundant data fetching. When multiple metrics are derived from the same base table (e.g., `employees`), combine them into a single `useQuery` that fetches the entire required dataset once and computes the derived stats locally, reducing network latency and database load.

## 2026-03-29 - Use Metadata Wrappers for List Filtering Optimization
**Learning:** Directly augmenting or cloning source data objects (e.g., `employees.map(e => ({ ...e, _searchStr }))`) to optimize list filtering breaks referential integrity. This can cause unnecessary re-renders in child components and break logic relying on object identity (e.g., selection state).
**Action:** When optimizing list filtering with `useMemo`, use a metadata wrapper pattern: `list.map(item => ({ item, precalculatedField }))`. Perform the filter on the metadata and then map back to the original `item` references. This preserves identity while still eliminating redundant allocations and operations during filtering.

## 2024-04-16 - Prevent Excessive API Calls via Debouncing React Query Keys
**Learning:** Using raw, rapidly changing state (like search input strings) directly as dependencies in a React Query `queryKey` can cause N+1-like network redundancies and excessive database/API calls on every single keystroke.
**Action:** When a user input drives a network query, always create a debounced version of the input using a hook (e.g., `useDebounce`) and use the debounced value in both the `queryKey` and `queryFn` to batch updates.
