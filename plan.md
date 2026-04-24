1. **Create `src/hooks/use-debounce.ts`**
   - Implemented a `useDebounce` hook that takes a generic value and returns a debounced version of it. I've just created this file.

2. **Update `src/pages/Employees.tsx`**
   - Import `useDebounce` from `src/hooks/use-debounce`.
   - Debounce the `search` state variable: `const debouncedSearch = useDebounce(search, 300);`
   - Update the `useQuery` call in `src/pages/Employees.tsx` to use `debouncedSearch` instead of `search` for both `queryKey` and `queryFn`. This limits the number of Supabase network requests as the user types.

3. **Update `src/pages/HelpDesk.tsx`**
   - Import `useDebounce` from `src/hooks/use-debounce`.
   - Debounce the `search` state variable: `const debouncedSearch = useDebounce(search, 300);`
   - Update the `useQuery` call in `src/pages/HelpDesk.tsx` to use `debouncedSearch` instead of `search` for both `queryKey` and `queryFn`. This limits the number of Supabase network requests as the user types.

4. **Add entry to `.jules/bolt.md`**
   - Log a critical learning about debouncing search inputs that are directly tied to API calls via React Query `useQuery` to reduce redundant network requests.

5. **Pre-commit verification**
   - Run formatting (`pnpm lint`), tests (`pnpm test`), and the build process (`pnpm build`).
   - Call `pre_commit_instructions` and follow its instructions to ensure proper testing, verification, review, and reflection are done.

6. **Submit PR**
   - Submit the change with the PR title format '⚡ Bolt: [performance improvement]'.
