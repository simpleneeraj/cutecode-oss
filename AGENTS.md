# CuteCode — Agent Conventions


## Stack
- **Framework:** Next.js 16 App Router, React 19. TypeScript (strict).
- **Route protection:** `apps/studio/src/proxy.ts` (Next 16 renamed `middleware`→`proxy`). Do NOT create `middleware.ts`.
- **ORM:** Drizzle (not Prisma). Schema in `apps/studio/src/db/schema.ts` + `apps/studio/src/db/auth-schema.ts`. Client `apps/studio/src/db/index.ts`.
- **Auth:** Better Auth (owns the `users` table via `@better-auth/drizzle-adapter`). Server `apps/studio/src/lib/auth.ts`, client `apps/studio/src/lib/auth-client.ts`. Catch-all route `apps/studio/src/app/api/auth/[...all]/route.ts`.
- **Payments:** Dodo Payments via the Better Auth plugin (`@dodopayments/better-auth`). Webhook route is served by the Better Auth catch-all at `/api/auth/dodopayments/webhooks`.
- **Email:** Amazon SES (`apps/studio/src/lib/ses.ts`) for verification + password reset.
- **API:** tRPC over HTTP (`@trpc/client` `httpBatchLink`, NOT React Query). Vanilla client in `apps/studio/src/lib/trpc.ts`.
- **Data fetching:** Components NEVER call `trpc` directly. They go through hooks in `apps/studio/src/hooks/use-*.ts` (SWR-backed, `"use client"`).

## SSR posture (minimal SSR)
Server-only endpoints:
- `apps/studio/src/app/api/auth/[...all]/route.ts` (Better Auth)
- `apps/studio/src/app/api/trpc/[trpc]/route.ts` (tRPC)
- `apps/studio/src/app/api/cron/billing/route.ts` (daily billing cron)

Everything else is a client component that fetches via tRPC + SWR hooks. Pages must NOT call `prisma`/`db` or `requireAuth` directly — move that into a tRPC procedure.

## Billing model
- **Three tiers:** FREE, **Pro** ($5/mo, $48/yr), **Premium** ($12/mo, $120/yr). Enum `Plan { FREE PRO PREMIUM }`.
- `PLANS` (capability map), `can`, `limit`, `PLAN_ORDER`, `isPlanAtLeast` live in `apps/studio/src/lib/billing/plans.ts`. Server gates use `requireCapability` in `apps/studio/src/lib/billing/require-capability.ts`.
- Four Dodo products (`NEXT_PUBLIC_DODO_PRODUCT_{PRO,PREMIUM}_{MONTHLY,YEARLY}`) plus the grandfathered legacy `NEXT_PUBLIC_DODO_PRODUCT_PREMIUM`, mapped in `apps/studio/src/lib/billing/products.ts` (`planForProduct`). Sync with `yarn workspace @cutecode/studio dodo:products`.
- Webhook handler `handleDodoEvent` is idempotent via the `webhook_events` table (store-first; unique-violation = skip).
- UI gating (`useSubscription`) is UX-only. All enforcement is server-side.

## Infra (AWS-only)
Amplify Hosting (Next SSR, `amplify.yml`) + RDS PostgreSQL (db.t4g.micro) + Amazon SES + EventBridge (daily billing cron) + CloudWatch RUM. AWS resources live in the `infra/` CDK app. Runbook: `docs/deploy-aws.md`. Dodo webhook → `https://<domain>/api/auth/dodopayments/webhooks`.

## Env
Only `apps/studio/.env.development` and `apps/studio/.env.production`. `.env.example` is deleted. Production secrets live only in SSM Parameter Store under `/cutecode/<branch>/` (loaded by `amplify.yml` for the build and by `apps/studio/src/lib/secrets.ts` at runtime); non-secret config is the `RUNTIME_VARS` allow-list in `amplify.yml`.

## Code style
- No comments unless asked.
- Follow existing imports/patterns in neighboring files.
- Never commit secrets.

## Commands
- `yarn lint` — ESLint
- `yarn typecheck` — `tsc --noEmit` (turbo, from the root)
- `yarn build` — `next build`
- `yarn workspace @cutecode/studio db:generate` — `drizzle-kit generate`
- `yarn workspace @cutecode/studio db:migrate` — `drizzle-kit migrate`
- `yarn workspace @cutecode/studio db:studio` — `drizzle-kit studio`
- `yarn test:unit` — Vitest unit tests (turbo, from the root)
- `yarn workspace @cutecode/studio test` — Vitest (unit + integration)
