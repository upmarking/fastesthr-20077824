## 2024-06-03 - Combine Supabase Queries for Dependent Metrics
**Learning:** In dashboards or overviews, fetching multiple dependent metrics (e.g., employee count, department stats, attrition count) via individual React Query `useQuery` calls results in an N+1-like network problem to Supabase. Even if run in parallel, it generates redundant queries on the same table (e.g., `employees`).
**Action:** Always inspect dashboard components for redundant data fetching. When multiple metrics are derived from the same base table (e.g., `employees`), combine them into a single `useQuery` that fetches the entire required dataset once and computes the derived stats locally, reducing network latency and database load.

## 2026-03-29 - Use Metadata Wrappers for List Filtering Optimization
**Learning:** Directly augmenting or cloning source data objects (e.g., `employees.map(e => ({ ...e, _searchStr }))`) to optimize list filtering breaks referential integrity. This can cause unnecessary re-renders in child components and break logic relying on object identity (e.g., selection state).
**Action:** When optimizing list filtering with `useMemo`, use a metadata wrapper pattern: `list.map(item => ({ item, precalculatedField }))`. Perform the filter on the metadata and then map back to the original `item` references. This preserves identity while still eliminating redundant allocations and operations during filtering.

## 2024-05-18 - Maintain Supabase DB Counts While Batching Profile Fetches
**Learning:** When attempting to resolve N+1 queries using `Promise.all` `.map` over Supabase queries, do not replace efficient DB-level exact counts (e.g., `.select('*', { count: 'exact', head: true })`) with batched row fetching (e.g., `.in(...)`) simply to compute the count locally. Fetching entire datasets into memory to perform a count causes severe performance and memory regressions when row limits scale.
**Action:** Resolve the N+1 problem on the profile/entity fetches by extracting IDs, deduping them, and batching via `.in()`, while continuing to execute the `head: true` count queries individually within the same concurrent `Promise.all` block.
