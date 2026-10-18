# CuteCode — Agent Conventions

Source of truth for the productionization plan: `.kilo/plans/1790519214215-productionize-single-sub-aws-betterauth.md`.

## Stack
- **Framework:** Next.js 16 App Router, React 19. TypeScript (strict).
- **Route protection:** `src/proxy.ts` (Next 16 renamed `middleware`→`proxy`). Do NOT create `middleware.ts`.
- **ORM:** Drizzle (not Prisma). Schema in `src/db/schema.ts` + `src/db/auth-schema.ts`. Client `src/db/index.ts`.
- **Auth:** Better Auth (owns the `users` table via `@better-auth/drizzle-adapter`). Server `src/lib/auth.ts`, client `src/lib/auth-client.ts`. Catch-all route `src/app/api/auth/[...all]/route.ts`.
- **Payments:** Dodo Payments via the Better Auth plugin (`@dodopayments/better-auth`). Webhook route is served by the Better Auth catch-all at `/api/auth/dodopayments/webhooks`.
- **Email:** Amazon SES (`src/lib/ses.ts`) for verification + password reset.
- **API:** tRPC over HTTP (`@trpc/client` `httpBatchLink`, NOT React Query). Vanilla client in `src/lib/trpc.ts`.
- **Data fetching:** Components NEVER call `trpc` directly. They go through hooks in `src/hooks/use-*.ts` (SWR-backed, `"use client"`).

## SSR posture (minimal SSR)
Server-only endpoints:
- `src/app/api/auth/[...all]/route.ts` (Better Auth)
- `src/app/api/trpc/[trpc]/route.ts` (tRPC)
- `src/app/api/cron/billing/route.ts` (daily billing cron)

Everything else is a client component that fetches via tRPC + SWR hooks. Pages must NOT call `prisma`/`db` or `requireAuth` directly — move that into a tRPC procedure.

## Billing model
- **Three tiers:** FREE, **Pro** ($5/mo, $48/yr), **Premium** ($12/mo, $120/yr). Enum `Plan { FREE PRO PREMIUM }`.
- `PLANS` (capability map), `can`, `limit`, `PLAN_ORDER`, `isPlanAtLeast` live in `src/lib/billing/plans.ts`. Server gates use `requireCapability` in `src/lib/billing/require-capability.ts`.
- Four Dodo products (`NEXT_PUBLIC_DODO_PRODUCT_{PRO,PREMIUM}_{MONTHLY,YEARLY}`) plus the grandfathered legacy `NEXT_PUBLIC_DODO_PRODUCT_PREMIUM`, mapped in `src/lib/billing/products.ts` (`planForProduct`). Sync with `yarn dodo:products`.
- Webhook handler `handleDodoEvent` is idempotent via the `webhook_events` table (store-first; unique-violation = skip).
- UI gating (`useSubscription`) is UX-only. All enforcement is server-side.

## Infra (AWS-only)
Amplify Hosting (Next SSR, `amplify.yml`) + RDS PostgreSQL (db.t4g.micro) + Amazon SES + EventBridge (daily billing cron) + CloudWatch RUM. AWS resources live in the `infra/` CDK app. Runbook: `docs/deploy-aws.md`. Dodo webhook → `https://<domain>/api/auth/dodopayments/webhooks`.

## Env
Only `.env.development` and `.env.production`. `.env.example` is deleted. Production secrets live only in SSM Parameter Store under `/cool-snippets/<branch>/` (loaded by `amplify.yml` for the build and by `src/lib/secrets.ts` at runtime); non-secret config is the `RUNTIME_VARS` allow-list in `amplify.yml`.

## Code style
- No comments unless asked.
- Follow existing imports/patterns in neighboring files.
- Never commit secrets.

## Commands
- `yarn lint` — ESLint
- `yarn type-check` — `tsc --noEmit`
- `yarn build` — `next build`
- `yarn db:generate` — `drizzle-kit generate`
- `yarn db:migrate` — `drizzle-kit migrate`
- `yarn db:studio` — `drizzle-kit studio`
- `yarn test` — Vitest (unit + integration)
- `yarn test:e2e` — Playwright

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
