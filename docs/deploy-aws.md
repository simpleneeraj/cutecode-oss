# Deploying to AWS

CuteCode runs on AWS Amplify Hosting (Next.js SSR, platform `WEB_COMPUTE`) in `us-east-1`, with RDS PostgreSQL, SES, an EventBridge billing cron and CloudWatch RUM. The `infra/` CDK app (stack `CutecodeMain`) holds the IAM roles and policies, the cron and the RUM monitor.

AWS docs do not list Next.js 16 as supported: they say "versions 12 through 15" ([Amplify support for Next.js](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-amplify-support.html)). The same setup runs Next 16.3.8 in production in the `invites` app. The same page lists Next.js streaming as unsupported, so `loading.tsx` boundaries can arrive as a single response.

## How a deploy works

`amplify.yml` runs these steps on every push to the connected branch:

1. Install with yarn on Node 22.
2. Write the `RUNTIME_VARS` allow-list to `.env.production`. These are non-secret values only, because anyone with the build artifact can read this file ([SSR environment variables](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-environment-variables.html)).
3. Export every SSM parameter under `/cutecode/<branch>/` into the build shell, using the Amplify service role.
4. Run `NODE_ENV=production yarn db:migrate`.
5. Run `yarn build`.

At runtime, `src/instrumentation.ts` loads the same SSM path with the compute role, and `src/proxy.ts` repeats the load as a fallback (`src/lib/secrets.ts`).

Migrations run while the previous release is still serving traffic. Every migration must therefore work with the deployed code: add first, remove in a later release.

## 1. Secrets in SSM

CloudFormation cannot create `SecureString` parameters, so create them once from a trusted machine:

```sh
for name in DATABASE_URL BETTER_AUTH_SECRET DODO_PAYMENTS_API_KEY DODO_PAYMENTS_WEBHOOK_KEY CRON_SECRET GITHUB_CLIENT_SECRET GOOGLE_CLIENT_SECRET; do
  read -rsp "$name: " value; echo
  aws ssm put-parameter --region us-east-1 --name "/cutecode/main/$name" --type SecureString --value "$value" --overwrite
done
```

`DATABASE_URL` stays one URL and is a secret because it contains the password. Keep `sslmode=require` in it. This means `src/db` and `drizzle.config.ts` need no changes. Splitting it into host/user/name plus `DATABASE_PASSWORD`, as `invites` does, only matters if the app moves to IAM database tokens.

## 2. Create the Amplify app

1. In the Amplify console, choose **Create new app > GitHub**, then pick the `cool-snippets` repo and branch `main`.
2. Keep the detected `amplify.yml`. Let Amplify create the service role and note its ARN.
3. Under **Hosting > Environment variables**, add:

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_BASE_URL` | `https://cutecode.app` |
| `BETTER_AUTH_URL` | `https://cutecode.app` |
| `DODO_PAYMENTS_ENVIRONMENT` | `live_mode` |
| `SES_FROM_EMAIL` | `no-reply@cutecode.app` |
| `KV_TABLE` | `cutecode-main-kv` (the `KvTableName` CDK output) |
| `GITHUB_CLIENT_ID`, `GOOGLE_CLIENT_ID` | OAuth client IDs |
| `NEXT_PUBLIC_DODO_PRODUCT_{PRO,PREMIUM}_{MONTHLY,YEARLY}`, `NEXT_PUBLIC_DODO_PRODUCT_PREMIUM` | Dodo product IDs |
| `NEXT_PUBLIC_RUM_APP_MONITOR_ID`, `NEXT_PUBLIC_RUM_IDENTITY_POOL_ID`, `NEXT_PUBLIC_RUM_REGION` | Values from the CDK outputs (step 3) |
| `LOG_LEVEL` | Optional, default `info` |

Never put a secret here. `AWS_REGION` is copied from the build container, and the console refuses names that start with `AWS`.

## 3. Deploy `infra/`

```sh
cd infra
yarn install --frozen-lockfile
npx cdk bootstrap aws://<account>/us-east-1
npx cdk deploy \
  -c serviceRoleArn=arn:aws:iam::<account>:role/<amplify-service-role> \
  --parameters CronAuthorizationHeader="Bearer $(aws ssm get-parameter --region us-east-1 --name /cutecode/main/CRON_SECRET --with-decryption --query Parameter.Value --output text)"
```

`cdk bootstrap` is needed only once per account. You can store `serviceRoleArn` in `infra/cdk.json` instead of passing `-c`.

The stack creates:

- **`cutecode-main-amplify-compute`**: trusted by `amplify.amazonaws.com`. It can read `/cutecode/*` and call `ses:SendEmail` from `SES_FROM_EMAIL`.
- **`cutecode-main-build-secrets`**: a managed policy on the service role that grants read access to `/cutecode/*`.
- **The `cutecode-main-billing-cron` rule**: runs daily at 03:00 UTC through an API destination to `GET https://cutecode.app/api/cron/billing`. Its connection uses `API_KEY` auth, which sends the `Authorization: Bearer <CRON_SECRET>` header (checked in `src/app/api/cron/billing/route.ts`). It retries twice.
- **The RUM app monitor `cutecode-main-web`**: covers the domain and `www`, with custom events enabled and CloudWatch Logs on. It also creates a Cognito identity pool with unauthenticated identities and a guest role allowed `rum:PutRumEvents`. The outputs are `RumAppMonitorId`, `RumIdentityPoolId` and `RumRegion`.

Then:

1. Go to **App settings > IAM roles > Compute role** and select `cutecode-main-amplify-compute`.
2. Set the three `NEXT_PUBLIC_RUM_*` variables and redeploy.

RUM stays off whenever these variables are missing, which covers local development. The CSP in `next.config.js` allows `dataplane.rum.<region>.amazonaws.com` and `cognito-identity.<region>.amazonaws.com` only when `NEXT_PUBLIC_RUM_REGION` is set at build time.

To rotate `CRON_SECRET`:

1. Update the SSM parameter.
2. Redeploy the app.
3. Re-run `cdk deploy` with the new header.

## 4. Domain, OAuth and Dodo

- **Domain:** go to **Hosting > Custom domains**, add `cutecode.app`, redirect `www` to the apex, then add the DNS records Amplify shows. `BETTER_AUTH_URL` and `NEXT_PUBLIC_BASE_URL` must equal `https://cutecode.app` exactly.
- **OAuth redirect URIs:**
  - GitHub: `https://cutecode.app/api/auth/callback/github`
  - Google: `https://cutecode.app/api/auth/callback/google`, with `https://cutecode.app` as an authorized origin
- **Dodo live webhook:**
  - URL: `https://cutecode.app/api/auth/dodopayments/webhooks`
  - Its signing secret goes in SSM as `DODO_PAYMENTS_WEBHOOK_KEY`; redeploy after changing it.
  - Run `yarn dodo:products` against live mode and copy the product IDs into the Amplify variables.

## 5. RDS access

Amplify SSR compute runs outside your VPC. The Amplify docs describe no VPC attachment for it, and its egress IPs are not fixed.

| Option | Pros | Cons |
| --- | --- | --- |
| Public endpoint + SSL (current) | No code change; works with the build-time migration | The security group must allow `0.0.0.0/0` on 5432. Protection rests on `rds.force_ssl=1`, a long random password and no default `postgres` user for the app |
| Private RDS | Not reachable from the internet | Amplify cannot reach it. It needs a different compute host (App Runner or ECS with a VPC connector), and the migration moves out of `amplify.yml` |

For the public option:

- Set `rds.force_ssl=1` in the parameter group.
- Use a dedicated app user that owns only the app schema.
- Enable automated backups and deletion protection.

## 6. Migrations from a trusted machine

The build migrates on every deploy. For the first cut-over, or a risky migration, take a snapshot and run the migration yourself first:

```sh
aws rds create-db-snapshot --region us-east-1 --db-instance-identifier <instance> --db-snapshot-identifier cutecode-$(date +%Y%m%d%H%M)
NODE_ENV=production yarn db:migrate
```

`drizzle.config.ts` reads `DATABASE_URL` from `.env.production`, which is local only and gitignored.

## 7. SES production access

```sh
aws sesv2 get-account --region us-east-1 --query '{prod:ProductionAccessEnabled,status:EnforcementStatus,quota:SendQuota}'
aws sesv2 get-email-identity --region us-east-1 --email-identity cutecode.app --query '{verified:VerifiedForSendingStatus,dkim:DkimAttributes.Status}'
```

`prod` must be `true`, and the identity must be verified with DKIM `SUCCESS`. Otherwise request production access in the SES console.

## 8. Logs and checks

- **Server logs:** CloudWatch Logs `/aws/amplify/<appId>` (pino JSON). Look for `[secrets] loaded N parameters` after each cold start; `[secrets] load failed` means the compute role or path is wrong.
- **Cron:** go to EventBridge > Rules > `cutecode-main-billing-cron` and check the `Invocations` / `FailedInvocations` metrics. Run it by hand with `curl -H "Authorization: Bearer $CRON_SECRET" https://cutecode.app/api/cron/billing`.
- **RUM:** CloudWatch > RUM > `cutecode-main-web`. App events from `src/lib/analytics` appear as custom events named `domain:action`.
- **Client IP:** `src/proxy.ts` sets `x-client-ip` from `cloudfront-viewer-address`, falling back to the last `x-forwarded-for` hop, the same as `invites`. Better Auth rate limits read only that header.
- **Size:** the server output must stay under Amplify's deployment size limit. The AWS SDK clients are in `serverExternalPackages` and server source maps are off. Check this first if a deploy fails at the upload step.
