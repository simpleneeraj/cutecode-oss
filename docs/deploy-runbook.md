# CuteCode deploy runbook

The record of the first production deploy of CuteCode on cutecode.app. No secrets are in this file.

- **Account:** AWS 489675988367
- **Region:** us-east-1
- **Repo:** simpleneeraj/cool-snippets, branch `main`

## Status

| # | Step | Status |
|---|---|---|
| 1 | Install the gddy CLI and authenticate with a PAT | Done |
| 2 | Move cutecode.app nameservers to GoDaddy | Done (propagating) |
| 3 | DNS `pg.cutecode.app` A → 18.207.59.26 | Done |
| 4 | Open SSH on invites-db to the owner's current IP | Blocked (needs owner) |
| 5 | Database `cutecode` and role `cutecode_app` on invites-db | Pending (needs 4) |
| 6 | TLS certificate covering `pg.cutecode.app` | Pending (needs 2 and 4) |
| 7 | SSM secrets under `/cutecode/main/` | Pending |
| 8 | Amplify service role, then `cdk deploy` | Pending |
| 9 | Amplify app `cutecode-web`, GitHub connection, env vars, domain | Pending |
| 10 | SES domain identity and DKIM | Pending |
| 11 | OAuth callbacks and Dodo webhook URL | Pending (owner) |
| 12 | Push `main`, build, migrate, smoke test | Pending |

## 1. gddy CLI
```sh
curl -fsSL https://github.com/godaddy/cli/releases/latest/download/install.sh | bash
gddy --version
```
- Installs gddy 0.2.29 to `~/.local/bin`.
- Auth uses the `GODADDY_ACCESS_TOKEN` personal access token stored in `.env`. Pass it as `GDDY_PAT=...` for each command.

## 2. Nameservers
- The registrar is GoDaddy.
- The nameservers were `ns1/ns2.vercel-dns.com`, left over from an old Vercel setup with no records that matter.
- The owner switched them to `ns51/ns52.domaincontrol.com` in GoDaddy.
- Check propagation with `dig +short NS cutecode.app @8.8.8.8`.
- Follow-up:
  - Remove cutecode.app from the Vercel account.
  - Turn on auto-renew. The domain expires 2027-03-08 and auto-renew is currently off.

## 3. Database host
```sh
gddy dns add cutecode.app --type A --name pg --data 18.207.59.26 --ttl 600
```
- `pg.cutecode.app` is the neutral hostname for the shared Lightsail Postgres, the `invites-db` instance.
- invites keeps using `db.invitely.link`.

## 4. SSH access to invites-db (owner)
Port 22 only allows a single IP, and the owner's IP has changed. In the Lightsail console, go to invites-db, then Networking, then the SSH rule, and set it to the current IP (`curl -s https://checkip.amazonaws.com`). Or run:
```sh
aws lightsail put-instance-public-ports --region us-east-1 --instance-name invites-db \
  --port-infos 'fromPort=80,toPort=80,protocol=tcp,cidrs=0.0.0.0/0' \
               'fromPort=5432,toPort=5432,protocol=tcp,cidrs=0.0.0.0/0' \
               "fromPort=22,toPort=22,protocol=tcp,cidrs=<YOUR_IP>/32,cidrListAliases=lightsail-connect"
```

## 5. Database and role (planned)
Run over `ssh ubuntu@db.invitely.link`, as the `postgres` superuser:
```sql
CREATE ROLE cutecode_app LOGIN PASSWORD '<generated, stored only in SSM>';
CREATE DATABASE cutecode OWNER cutecode_app;
REVOKE ALL ON DATABASE cutecode FROM PUBLIC;
```
The invites database and role are untouched.

## 6. TLS (planned)
```sh
sudo certbot certonly --standalone --expand -d db.invitely.link -d pg.cutecode.app --dry-run
sudo certbot certonly --standalone --expand -d db.invitely.link -d pg.cutecode.app
```
- Run after the nameservers have propagated.
- The existing deploy hook copies the certificate into Postgres and reloads it.

## Known follow-ups
- **Shared database limits:** invites and CuteCode share 512 MB of RAM and 40 connections. CuteCode uses pg's default pool (10 connections, 10 s idle timeout). A cap of 3 deadlocked parallel publishes in tests, so it was reverted.
- **Remix transaction:** the remix flow calls `generateUniqueSlug()` on the global `db` inside a transaction. Pass `tx` instead before ever shrinking the pool.
- **AWS login:** the CLI is logged in as the root account. Create an IAM user or SSO for deploys.
