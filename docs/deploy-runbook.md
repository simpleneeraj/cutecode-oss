# CuteCode deploy runbook

The record of the first production deploy of CuteCode, finished 2026-10-18. No secret values are in this file.

- **Live:** https://www.cutecode.app. The bare domain https://cutecode.app redirects there with a 301 via GoDaddy forwarding.
- **Account:** AWS 489675988367, region us-east-1.
- **Repo:** simpleneeraj/cutecode-classic, branch `main`. Every push deploys.

## What exists

| Piece | Name / value |
|---|---|
| Amplify app | `cutecode-web` (`d3bad3vjedksxl`), WEB_COMPUTE, branch `main`, auto-build |
| Amplify service role (build) | `cutecode-main-amplify-service`: inline `build` policy for logs, plus the CDK `cutecode-main-build-secrets` policy |
| Amplify compute role (runtime) | `cutecode-main-amplify-compute`, attached at the **branch** level |
| CDK stack | `CutecodeMain`: KV table, compute role, billing cron, RUM, alarms |
| KV store | DynamoDB `cutecode-main-kv`: on-demand, TTL `expiresAt`, point-in-time recovery, deletion protection |
| Billing cron | EventBridge `cutecode-main-billing-cron`, daily 03:00 UTC, calling `https://www.cutecode.app/api/cron/billing` |
| RUM | app monitor `cutecode-main-web`, Cognito pool `cutecode-main-rum` |
| Database | Postgres 18 on the shared Lightsail `invites-db`: database `cutecode`, role `cutecode_app`, host `pg.cutecode.app` |
| Secrets | SSM SecureString under `/cutecode/main/`: DATABASE_URL, BETTER_AUTH_SECRET, CRON_SECRET, DODO_PAYMENTS_API_KEY, DODO_PAYMENTS_WEBHOOK_KEY, GITHUB_CLIENT_SECRET, GOOGLE_CLIENT_SECRET |
| Email | SES domain identity `cutecode.app` with DKIM. The account already has production access. |
| DNS | GoDaddy (`ns51`/`ns52.domaincontrol.com`), managed with the `gddy` CLI |

## DNS records (GoDaddy)

| Name | Type | Value |
|---|---|---|
| `www` | CNAME | `d27afdd5l1te7g.cloudfront.net` (Amplify) |
| `_62dc2da34300ad219263a20bf088a60b` | CNAME | ACM validation for the Amplify certificate |
| `pg` | A | `18.207.59.26` (invites-db static IP) |
| `<3 tokens>._domainkey` | CNAME | `<token>.dkim.amazonses.com` (SES DKIM) |
| `_dmarc` | TXT | `v=DMARC1; p=none; rua=mailto:dmarc@cutecode.app` |
| `@` | forwarding | 301 to `https://www.cutecode.app`, set in the GoDaddy UI |

## Steps as run

1. **gddy CLI:**
   - Installed with `curl -fsSL https://github.com/godaddy/cli/releases/latest/download/install.sh | bash` (v0.2.29).
   - Auth is a personal access token from `.env.production`, passed as `GDDY_PAT`.
2. **Nameservers:** moved from Vercel DNS to GoDaddy (done by the owner).
3. **SSH to invites-db:**
   - The SSH rule moved to the owner's current IP with `aws lightsail put-instance-public-ports`.
   - Access uses short-lived keys: `aws lightsail get-instance-access-details --protocol ssh`. The instance only accepts `LightsailDefaultKeyPair`.
4. **Database:**
   - Over SSH, as the `postgres` superuser: `CREATE ROLE cutecode_app LOGIN PASSWORD …; CREATE DATABASE cutecode OWNER cutecode_app; REVOKE ALL ON DATABASE cutecode FROM PUBLIC;`
   - The password was generated locally and passed over stdin. It's stored only inside the SSM `DATABASE_URL`.
5. **TLS for the database:**
   - `certbot certonly --standalone --cert-name db.invitely.link --expand -d db.invitely.link -d pg.cutecode.app`, run with `--dry-run` first.
   - The deploy hook copies the certificate into Postgres. invites keeps working.
6. **SSM secrets:** written with `aws ssm put-parameter --type SecureString --value file://…`, never on the command line or in logs.
7. **Service role:** `aws iam create-role cutecode-main-amplify-service`, with the same trust policy as invites.
8. **CDK:** `cd infra && npx cdk deploy -c serviceRoleArn=<service role> --parameters CronAuthorizationHeader="Bearer <CRON_SECRET>"`
9. **Amplify:**
   - `aws amplify create-app --access-token "$(gh auth token)"` with the service role, compute role and environment variables.
   - Then `create-branch main --stage PRODUCTION --enable-auto-build`.
   - Then `update-branch --compute-role-arn` (see the gotchas).
   - Then `create-domain-association cutecode.app`.
10. **SES:** `aws sesv2 create-email-identity --email-identity cutecode.app`. The DKIM and DMARC records went in through gddy.
11. **OAuth and Dodo:**
    - The owner created the GitHub OAuth app `cutecode.app` and the Google client in project `cutecode-platform`. Callbacks are `https://www.cutecode.app/api/auth/callback/{github,google}`.
    - The Dodo webhook is `https://www.cutecode.app/api/auth/dodopayments/webhooks`.
12. **Push `main`:** Amplify builds, runs `db:migrate`, and deploys.

## Smoke test (build 3)

| Check | Result |
|---|---|
| `/`, `/snippets`, `/pricing`, `/account/sign-in`, `/checkout/failure`, `/legal/privacy` | 200 |
| `/sitemap.xml`, `/robots.txt`, `/api/auth/ok`, tRPC `billing.pricing` and `snippet.explore` | 200 |
| `/api/cron/billing` without auth / with `CRON_SECRET` | 401 / 200 |
| Runtime secrets | 7 loaded from `/cutecode/main/` on the first request |
| DynamoDB `cutecode-main-kv` | rate-limit items written |
| `https://cutecode.app` | 301 to www |

## Gotchas hit

- **The compute role must be on the branch.** Setting `--compute-role-arn` on `create-app` alone left the server with no AWS credentials. invites sets it on the branch too.
- **SSM can't be reached during server startup on Amplify.** The startup hook's SSM call fails with `CredentialsProviderError`. `ensureRuntimeSecrets` now logs the error and lets `src/proxy.ts` load the secrets on the first request (commit `a1b14674`). The startup error in the logs is expected.
- **GoDaddy can't do apex ALIAS.** gddy lists `ALIAS`, but the API rejects it. www is canonical, and the apex uses GoDaddy forwarding.
- **`.app` is HSTS-preloaded.** The apex forward only works over HTTPS once GoDaddy has issued its forwarding certificate, which took a few minutes.
- **Lightsail SSH needs short-lived keys.** The instance only trusts `LightsailDefaultKeyPair`, so use `get-instance-access-details`. The keys expire within minutes.
- **The local production build needs a real `DATABASE_URL`.** The sitemap is prerendered at build time and queries the database. `.env.production` now mirrors SSM; run `yarn env:check` to confirm.

## Dodo products

`yarn dodo:products` is `scripts/dodo/products.ts`. It is idempotent: it matches products by name `CuteCode <Plan> <Interval>`, creates missing ones and updates changed prices.
- **Live:** `NODE_ENV=production npx tsx scripts/dodo/products.ts --live`. Use `--dry-run` first.
- **Test:** `NODE_ENV=development npx tsx scripts/dodo/products.ts`.
- **Where the IDs go:** live IDs go in `.env.production` and the Amplify environment variables, test IDs in `.env.development`. They're `NEXT_PUBLIC_*`, so changing them needs a rebuild.
- **Prices:** Pro $5/month or $48/year, Premium $12/month or $120/year, from `src/lib/billing/plans.ts`. Created 2026-10-18 in both modes.
- **Legacy product:** `NEXT_PUBLIC_DODO_PRODUCT_PREMIUM` stays set for webhook mapping of the old Premium product.

## Env workflow

- `.env.development` and `.env.production` share the same 27 keys. Production-only keys are empty in development.
- `yarn env:pull` refreshes `.env.production` from SSM and Amplify. `yarn env:check` lists drifted keys by name.
- To change a secret, update SSM first, run `yarn env:pull`, then redeploy (push, or `aws amplify start-job --job-type RELEASE`).

## Monthly cost (us-east-1, current traffic, estimates from list prices)

| Item | Est. per month |
|---|---|
| Lightsail `invites-db` (shared with invites; no extra charge for CuteCode) | $0 extra (instance is $5) |
| Amplify Hosting: builds at about $0.01 per build minute, plus SSR requests and data | $1–5 |
| DynamoDB on-demand + point-in-time recovery | < $1 |
| SES ($0.10 per 1,000 emails) | < $1 |
| CloudWatch RUM + logs + alarms (2 alarms at about $0.10 each) | ~$1 |
| SSM standard parameters, EventBridge daily cron, Cognito identity pool | $0 |
| **Total AWS** | **≈ $3–8** |
| Domain renewal cutecode.app (GoDaddy, yearly) | registrar price |

## Follow-ups

- **Domain:** turn on cutecode.app auto-renew (it expires 2027-03-08). Remove cutecode.app from the old Vercel account.
- **Alarms:** add an SNS topic and alert email to the CDK stack. The alarms currently have no actions.
- **AWS login:** create an IAM user or SSO for deploys instead of the root login.
- **Database:**
  - CuteCode uses pg's default pool (10). invites-db allows 40 connections in total, so watch it as traffic grows.
  - Remix calls `generateUniqueSlug()` on the global `db` inside a transaction. Pass `tx` before ever shrinking the pool.
- **Dedicated database:** move CuteCode to its own instance once it has real users.
