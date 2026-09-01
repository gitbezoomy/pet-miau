<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN: feature-dev-cycle -->
After every task considered complete, you have to do the following steps:
1. Run `npm run lint` to check for linting errors.
2. Run `npm run typecheck` to check for type errors.
3. Use the chrome devtools MCP to review your changes visually and check for any runtime errors in the console.
4. Commit using conventional commits.
<!-- END: feature-dev-cycle -->

## SECURITY

- Use `@supabase/ssr` for every authenticated Next.js path. Create request-scoped server clients with cookies and refresh sessions in `src/proxy.ts`.
- Protect pages and user data with `supabase.auth.getClaims()` or `getUser()`. Never use `getSession()` or client-provided identity data for authorization.
- Treat every `NEXT_PUBLIC_*` value as public. Never expose a Supabase service-role or secret key to browser code.
- Enforce ownership in Postgres RLS, not only in application filters. Use `TO authenticated` together with `(select auth.uid()) = user_id`; add both `USING` and `WITH CHECK` for updates.
- Never authorize with `user_metadata`; it is user-editable. Use server-verified identity and database ownership columns.
- Treat `localStorage`, hidden form fields, query parameters, route params, and client totals as untrusted. Re-fetch prices, availability, and ownership server-side before mutations or checkout.
- Validate parsed JSON with runtime schemas or explicit type guards, including finite numeric bounds, maximum quantities, string lengths, and allowed URL hosts.
- Keep user data behind authenticated routes and owner-scoped RLS. Demo data must not be presented as another user's authenticated data.
- Keep exposed tables least-privilege: grant only required operations to `anon` or `authenticated`, enable RLS on every exposed table, and add indexes for RLS predicates.
- Preserve browser hardening headers: CSP, `frame-ancestors`/`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and HSTS on HTTPS deployments. Keep CSP compatible with Next, Supabase, image hosts, and analytics.
- For security changes, verify both unauthenticated denial and authenticated owner access, inspect browser console/runtime errors, run `npm run lint`, `npm run typecheck`, and test the relevant Supabase RLS behavior.
