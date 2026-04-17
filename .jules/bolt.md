## 2024-12-05 - N+1 Query Anti-Pattern in React Query
**Learning:** Avoid using `Promise.all` `.map` loops containing independent database `.select()` queries inside `useQuery` query functions. This triggers sequential parallel queries, creating an N+1 scaling bottleneck that significantly slows down frontend rendering as lists grow.
**Action:** Extract all IDs into a unique array, execute a single `supabase.from().select().in()` bulk query, and construct a local Javascript Map to join the fetched data back to the primary list.
